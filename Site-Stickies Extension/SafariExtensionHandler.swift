//
//  SafariExtensionHandler.swift
//  Site-Stickies Extension
//
//  Created by George Botros on 2/5/21.
//

import SafariServices

let defaults = UserDefaults.init(suiteName: "shockerella.Site-Stickies")

struct StickyNote: Codable {
    var left: Int?
    var top: Int?
    var content: String?
}

class SafariExtensionHandler: SFSafariExtensionHandler {

    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String: Any]?) {

        page.getPropertiesWithCompletionHandler { properties in
            let url = properties?.url?.absoluteString

            // whenever a page loads, the script will ask to getCurrentNotes to see (and then render) what nots have previously been written on that page.
            if messageName == "getCurrentNotes" {
                let decoder = JSONDecoder()
                let notesFromMemoryJSON = defaults!.object(forKey: "\(url!)") as? Data
                let notesFromMemory = try? decoder.decode([StickyNote].self, from: notesFromMemoryJSON!)

                var messageToReturn = [String: Any]()
                for (index, note) in notesFromMemory!.enumerated() {
                    messageToReturn["\(index)"] = [note.content!, note.left!, note.top!]
                }
                page.dispatchMessageToScript(withName: "printToConsole", userInfo: messageToReturn)
                page.dispatchMessageToScript(withName: "notesFromStorage", userInfo: messageToReturn)
            }

            if messageName == "noteUpdate" {
                // this appends a note to the userInfo of a specific page's defautls.
                var notesOnPage = [StickyNote]()
                let info = userInfo as? [String: [Any]]
                for (_, properties) in info! {
                    let note = StickyNote(left: properties[1] as? Int, top: properties[2] as? Int, content: properties[0] as? String)
                    notesOnPage.append(note)
                }
                let encoder = JSONEncoder()
                if let notesOnPageJSON = try? encoder.encode(notesOnPage) {
                    defaults!.set(notesOnPageJSON, forKey: "\(url!)")
                }
                
                // encoded "allTerms": lsadkfjlksdajflkdasj
                /* decode lsadkfjlksdajflkdasj to
                ["wikipedia": [Note(3,2,"hi"), Note(4,5,"hello")],
                 "google": [Note(100,305,"send that email")]]
                 
                 overwrite with changes
                 notesOnPage ["wikipedia": [Note(3,2,"hi"), Note(4,10,"asdfjlkj")]
                 currentNotesAsDictionary would go from this:
                 ["wikipedia": [Note(3,2,"hi"), Note(4,5,"hello")],
                 "google": [Note(100,305,"send that email")]]
                 to
                 ["wikipedia": [Note(3,2,"hi"), Note(4,10,"asdfjlkj")],
                  "google": [Note(100,305,"send that email")]]
                 reencode lasdjflksjalkfjsdalkfdjlksajdflkn
                 "allTerms": adsklfjldsakjflksamfdlksam
                */
                let decoder = JSONDecoder()
                var currentDictionaryAsDictionary = [String: [StickyNote]]();
                if (defaults?.object(forKey: "allTerms") != nil){
                    let currentDictionaryAsData = defaults?.object(forKey: "allTerms") as! Data
                    currentDictionaryAsDictionary = try! decoder.decode([String: [StickyNote]].self, from: currentDictionaryAsData)
                   
                }
                 
                currentDictionaryAsDictionary["\(url!)"] = notesOnPage //overwrite the url's notes with new notes
                
                if let updatedDictionaryAsData = try? encoder.encode(currentDictionaryAsDictionary){
                    defaults!.set(updatedDictionaryAsData, forKey: "allTerms")
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
