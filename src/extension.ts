// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as child_process from 'child_process'
import {promisify} from 'util'
// import {sample} from './debug'

const exec = promisify(child_process.exec)
const WIDTH = 22
const BLACK = 'rgba(0,0,0,0.6)'
const RED = 'rgba(255,0,0,0.6)'
const YELLOW = 'rgba(255,255,0,0.6)'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Deeptest extension activated.')
  const decorationType: vscode.TextEditorDecorationType = vscode.window.createTextEditorDecorationType(
    {}
  )

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'deeptest.toggleDeeptest',
    async () => {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      const configKey = 'visible'
      const isVisible = !context.workspaceState.get(configKey, false)
      context.workspaceState.update(configKey, isVisible)

      const openEditor = vscode.window.visibleTextEditors[0]

      openEditor.setDecorations(decorationType, [])

      if (!isVisible) {
        return
      }

      const cwd = `${vscode.workspace.workspaceFolders![0].uri.path}/.deeptest`
      const source = openEditor.document.fileName
      const cli: string = (vscode.workspace.getConfiguration() as any).get(
        'deeptest'
      ).cliLocation

      const cmd = `cd ${cwd} && ${cli} ${source}`
      console.log(`RUNNING: ${cmd}`)
      try {
        await exec(`which ${cli}`)
      } catch (e: any) {
        vscode.window.showErrorMessage(
          `Cannot find deeptest cli at "${cli}", please check the deeptest vscode settings.`
        )
        return
      }
      try {
        vscode.window.showInformationMessage(
          'Showing per-line test results. Click again to hide.'
        )
        const res = await exec(cmd)
        console.log(res)
        const data = JSON.parse(res.stdout)
        // const data = JSON.parse(sample)
        decorate(openEditor, data, decorationType)
      } catch (ee: any) {
        const data = JSON.parse(ee.stdout)
        console.log(ee)
        if (data.error) {
          vscode.window.showErrorMessage(data.error)
          return
        }
        vscode.window.showErrorMessage(
          'Deeptest Exception ocurred. Please check the logs in the OUTPUT panel below.'
        )
      }
    }
  )

  context.subscriptions.push(disposable)
}

interface Line {
  passed: string[]
  failed: string[]
}

function getContent(line: Line | null, num: number): [string, string, string] {
  let textContent = ''
  let passed = ''
  let failed = ''
  let color = BLACK

  if (line === null) {
    return ['-'.padStart(WIDTH, '-'), '', 'rgba(0,0,0,0)']
  }

  if (line.passed.length > 0) {
    textContent += `${line.passed.length} passed`
    passed = `**${line.passed.length} Passed:**\n\n${line.passed.join('\n\n')}`
  }

  if (line.failed.length > 0) {
    color = RED
    textContent += `-${line.failed.length} failed`
    failed = `**${line.failed.length} Failed:**\n\n${line.failed.join('\n\n')}`
  } // ✖✔

  if (textContent.length === 0) {
    color = YELLOW
    textContent = 'No tests'
  }

  textContent = textContent.padStart(WIDTH, '-')
  const hover = `**Line ${num}**:\n\n ${[failed, passed].join('\n\n')}`

  return [textContent, hover, color]
}

function decorate(
  editor: vscode.TextEditor,
  data: any,
  deeptestDecorationType: vscode.TextEditorDecorationType
): void {
  const decs = []
  for (let line = 0; line < editor.document.lineCount; line++) {
    let range = new vscode.Range(
      new vscode.Position(line, 0),
      new vscode.Position(line + 1, 0)
    )

    const lineObj = data.lines[`${line + 1}`] || (null as Line | null)
    const [contentText, hoverMessage, color] = getContent(lineObj, line)

    const decoration: vscode.DecorationOptions = {
      hoverMessage,
      range,
      renderOptions: {
        before: {
          backgroundColor: 'rgba(0,0,0,0.2)',
          color,
          height: '100%',
          margin: '0 26px -1px 0',
          contentText
        }
      }
    }
    decs.push(decoration)
  }
  editor.setDecorations(deeptestDecorationType, decs)
}

// this method is called when your extension is deactivated
export function deactivate(): void {}
