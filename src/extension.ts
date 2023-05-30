import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // Handle toggle command
  const handleToggleCommand = vscode.commands.registerCommand(
    "md-toggle-checkbox-state.toggleCheckbox",
    () => {
      // if there is no active text editor, show message and return
      if (!vscode.window.activeTextEditor) {
        vscode.window.showInformationMessage("No active text editor");
        return;
      }

      // get current line text
      const currentLineText = vscode.window.activeTextEditor.document.lineAt(
        vscode.window.activeTextEditor.selection.active.line
      ).text;

      // detect symbol style
      const hasStarStyle = currentLineText.indexOf("* [") === 0;
      const hasPlusStyle = currentLineText.indexOf("+ [") === 0;

      // adhere to symbol convention if any
      let symbol = "-";
      if (hasStarStyle) {
        symbol = "*";
      } else if (hasPlusStyle) {
        symbol = "+";
      }

      // detect checkbox state
      const hasCheckbox = currentLineText.indexOf(`${symbol} [`) === 0;
      const hasCheckboxUnchecked =
        currentLineText.indexOf(`${symbol} [ ]`) === 0;
      const hasCheckboxChecked = currentLineText.indexOf(`${symbol} [x]`) === 0;

      // if there is no checkbox at the beginning of the line, add one
      if (!hasCheckbox) {
        vscode.window.activeTextEditor.edit((editBuilder) => {
          if (!vscode.window.activeTextEditor) return;
          editBuilder.insert(
            new vscode.Position(
              vscode.window.activeTextEditor.selection.active.line,
              0
            ),
            `${symbol} [ ] `
          );
        });
      }

      // if there is an unchecked checkbox, check it
      else if (hasCheckboxUnchecked) {
        const hasSpaceAfter = currentLineText.indexOf(`${symbol} [ ] `) === 0;
        vscode.window.activeTextEditor.edit((editBuilder) => {
          if (!vscode.window.activeTextEditor) return;
          editBuilder.replace(
            new vscode.Range(
              new vscode.Position(
                vscode.window.activeTextEditor.selection.active.line,
                0
              ),
              new vscode.Position(
                vscode.window.activeTextEditor.selection.active.line,
                hasSpaceAfter ? 6 : 5
              )
            ),
            `${symbol} [x] `
          );
        });
      }

      // if there is a checked checkbox, remove checkbox syntax
      else if (hasCheckboxChecked) {
        const hasSpaceAfter = currentLineText.indexOf(`${symbol} [x] `) === 0;
        vscode.window.activeTextEditor.edit((editBuilder) => {
          if (!vscode.window.activeTextEditor) return;
          editBuilder.replace(
            new vscode.Range(
              new vscode.Position(
                vscode.window.activeTextEditor.selection.active.line,
                0
              ),
              new vscode.Position(
                vscode.window.activeTextEditor.selection.active.line,
                hasSpaceAfter ? 6 : 5
              )
            ),
            ""
          );
        });
      }
    }
  );

  // register toggle command
  context.subscriptions.push(handleToggleCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {
  vscode.window.showInformationMessage(
    "'MD Toggle Checkbox State' is now deactivated!"
  );
}
