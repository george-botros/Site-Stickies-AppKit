//
//  SafariExtensionHandler.swift
//  Site-Stickies Extension
//
//  Created by George Botros on 2/5/21.
//

import SafariServices

let defaults = UserDefaults.init(suiteName: "L27L4K8SQU.Site-Stickies")

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
            page.dispatchMessageToScript(withName: "currentNotes", userInfo: ["y": object?.top ?? 5, "x": object?.left ?? 3]) // also send user info describing what/where notes should be on page.
        }
        
        if messageName == "noteUpdate" {
            var note = StickyNote()
            let encoder = JSONEncoder()
            note.content = userInfo!["content"] as? String
            note.top = userInfo!["top"] as? Int
            note.left = userInfo!["left"] as? Int
            page.dispatchMessageToScript(withName: "printToConsole", userInfo: ["co": "hi"])
            if let noteAsData = try? encoder.encode(note) {
                print(noteAsData)
                defaults!.set(noteAsData, forKey: "note")
                page.dispatchMessageToScript(withName: "printToConsole", userInfo: ["co": note.content])
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
    
    override func validateToolbarItem(in window: SFSafariWindow, validationHandler: @escaping ((Bool, String) -> Void)) {
        // This is called when Safari's state changed in some way that would require the extension's toolbar item to be validated again.
        validationHandler(true, "")
    }
    
    override func popoverViewController() -> SFSafariExtensionViewController {
        return SafariExtensionViewController.shared
    }

}
