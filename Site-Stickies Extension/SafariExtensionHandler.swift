//
//  SafariExtensionHandler.swift
//  Site-Stickies Extension
//
//  Created by George Botros on 2/5/21.
//

import SafariServices

let defaults = UserDefaults.init(suiteName: "shockerella.Site-Stickies")

struct StickyNote: Codable {
    var top: Int?
    var left: Int?
    var content: String?
}

class SafariExtensionHandler: SFSafariExtensionHandler {
    
    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]?) {

        page.getPropertiesWithCompletionHandler { properties in
            let url = properties?.url?.absoluteString
            
            // whenever a page loads, the script will ask to getCurrentNotes to see (and then render) what nots have previously been written on that page.
            if messageName == "getCurrentNotes" {
                let decoder = JSONDecoder()
                let notesFromMemoryJSON = defaults!.object(forKey: "\(url!)") as! Data
                let notesFromMemory = try! decoder.decode([StickyNote].self, from: notesFromMemoryJSON)
                
                var messageToReturn = [String: Any]()
                for (index, note) in notesFromMemory.enumerated() {
                    messageToReturn["\(index)"] = [note.content, note.left, note.top]
                }
                page.dispatchMessageToScript(withName: "printToConsole", userInfo: messageToReturn)
                page.dispatchMessageToScript(withName: "notesFromStorage", userInfo: messageToReturn)
                // George, I finally got data storage and retireval working. For you to do: implement a function in script.js that will respond to the message "notesFromStorage" and use its userInfo (messageToReturn) to create notes in the HTML page in the correct positions and with the correct content.
            }

            // whenever the script notices a change to the notes (position), it will send the message 'noteUpdate' alerting the extension of the script. The userInfo of this message will be the position & content of every note. The following function's purpose is to write these updated values to memory (UserDefaults).
            if messageName == "noteUpdate" {
                var notesOnPage = [StickyNote]()
                let info = userInfo as! [String : [Any]]
                for (noteNumber, properties) in info {
                    let note = StickyNote(top: properties[1] as? Int, left: properties[2] as? Int, content: properties[0] as? String)
                    notesOnPage.append(note)
                }
                let encoder = JSONEncoder()
                if let notesOnPageJSON = try? encoder.encode(notesOnPage) {
                    defaults!.set(notesOnPageJSON, forKey: "\(url!)")
                }
            }
        }

    }

    override func toolbarItemClicked(in window: SFSafariWindow) {
        window.getActiveTab { (tab) in
            tab?.getActivePage(completionHandler: { (page) in
                page?.dispatchMessageToScript(withName: "toolbarItemClicked")
                })
            }
    }

}
