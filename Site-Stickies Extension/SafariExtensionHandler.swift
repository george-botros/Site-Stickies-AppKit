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
    // add url property later.
}

class SafariExtensionHandler: SFSafariExtensionHandler {
    
    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]?) {
        // This method will be called when a content script provided by your extension calls safari.extension.dispatchMessage("message").
        if messageName == "getCurrentNotes" {
            // check local storage
            let decoder = JSONDecoder()
            let note = defaults!.object(forKey: "note") as! Data
            let object = try? decoder.decode(StickyNote.self, from: note)
        }
        
        if messageName == "noteUpdate" {
            var note = StickyNote()
            let encoder = JSONEncoder()
            note.content = userInfo!["content"] as? String
            note.top = userInfo!["top"] as? Int
            note.left = userInfo!["left"] as? Int
            if let noteAsData = try? encoder.encode(note) {
                defaults!.set(noteAsData, forKey: "note")
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
