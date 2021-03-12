import * as vscode from 'vscode'
import * as child_process from 'child_process'
import {promisify} from 'util'
// import {sample} from './debug'

const exec = promisify(child_process.exec)
const WIDTH = 13
const RED = '#DF0E25'
const GREEN = '#00CE1C'
const YELLOW = '#939B00'
const UNICODE_SPACE = ' '
const configKey = 'visible'

interface Line {
  passed: string[]
  failed: string[]
}

interface ExecRes {
  stdout: string
  stderr: string
}
class CliRunner {
  constructor(private cli: string, private cwd: string) {}

  async run(cmd: string): Promise<ExecRes> {
    const shellCmd = `${this.cli} ${cmd} --data-dir=${this.cwd}`
    console.log(shellCmd)
    try {
      return await exec(shellCmd)
    } catch (ee: any) {
      console.log(ee)
      console.log(ee.sdterr)
      throw ee
    }
  }
}

export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  console.log('Deeptest extension activated.')
  const decorationType: vscode.TextEditorDecorationType = vscode.window.createTextEditorDecorationType(
    {}
  )

  let decoratedEditors = new Set<vscode.TextEditor>()
  const cwd = `${vscode.workspace.workspaceFolders![0].uri.path}/.deeptest`
  const cli: string = (vscode.workspace.getConfiguration() as any).get(
    'deeptest'
  ).cliLocation
  const cliRunner = new CliRunner(cli, cwd)

  let disposable = vscode.commands.registerCommand(
    'deeptest.toggleDeeptest',
    async () => {
      try {
        await exec(`which ${cli}`)
      } catch (e: any) {
        vscode.window.showErrorMessage(
          `Cannot find deeptest cli at "${cli}", please check the deeptest vscode settings.`
        )
        return
      }
      const isVisible = !context.workspaceState.get(configKey, false)

      if (isVisible) {
        const status = JSON.parse((await cliRunner.run('')).stdout)
        if (status.time_since_run === null) {
          vscode.window.showErrorMessage('No data in .deeptest dir to show')
          return
        }
        const time = status.time_since_run
        vscode.window.showInformationMessage(`Showing test data from ${time}`)
        vscode.window.visibleTextEditors.map(async editor => {
          editor.setDecorations(decorationType, await getDecorations(editor))
          decoratedEditors.delete(editor)
        })
      } else {
        vscode.window.showInformationMessage('Deeptest: off.')
        vscode.window.visibleTextEditors.map(editor =>
          editor.setDecorations(decorationType, [])
        )
      }
      context.workspaceState.update(configKey, isVisible)
    }
  )

  const disp = vscode.window.onDidChangeActiveTextEditor(async openEditor => {
    if (openEditor === undefined) {
      return
    }
    const isVisible = context.workspaceState.get(configKey, false)

    if (!isVisible) {
      openEditor.setDecorations(decorationType, [])
      return
    }

    if (decoratedEditors.has(openEditor)) {
      return
    }
    openEditor.setDecorations(decorationType, await getDecorations(openEditor))
    decoratedEditors.add(openEditor)
  })

  context.subscriptions.push(disposable)
  context.subscriptions.push(disp)

  function getContent(
    line: Line | null,
    num: number
  ): [string, string, string] {
    let textContent = ''
    let passed = ''
    let failed = ''
    let color = GREEN

    if (line === null) {
      return [UNICODE_SPACE.padStart(WIDTH, UNICODE_SPACE), '', 'rgba(0,0,0,0)']
    }

    if (line.passed[0] === 'ran on startup') {
      textContent += '•'
      color = GREEN
      passed = 'ran on startup'
    } else if (line.failed.length > 0 || line.passed.length > 0) {
      const statements = []
      if (line.failed.length > 0) {
        color = RED
        statements.push(`${line.failed.length} ✖`)
        failed = `**${line.failed.length} Failed:**\n\n${line.failed.join(
          '\n\n'
        )}`
      }
      if (line.passed.length > 0) {
        statements.push(`${line.passed.length} ✔`)
        passed = `**${line.passed.length} Passed:**\n\n${line.passed.join(
          '\n\n'
        )}`
      }
      textContent += statements.join(', ')
    } else {
      color = YELLOW
      textContent = `0`
    }

    textContent = textContent.padStart(WIDTH, UNICODE_SPACE)
    const hover = `**Line ${num}**:\n\n ${[failed, passed].join('\n\n')}`

    return [textContent, hover, color]
  }

  async function getDecorations(
    editor: vscode.TextEditor
  ): Promise<vscode.DecorationOptions[]> {
    const source = editor.document.fileName

    const cmd = `${cli} ${source} --data-dir=${cwd}`
    console.log(`RUNNING: ${cmd}`)

    try {
      const res = await exec(cmd)
      console.log(res)
      const data = JSON.parse(res.stdout)
      // const data = JSON.parse(sample)
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
              backgroundColor: 'rgba(0,0,0,0)',
              color,
              height: '100%',
              margin: '0 26px -1px 0',
              contentText
            }
          }
        }
        decs.push(decoration)
      }
      return decs
    } catch (ee: any) {
      console.log('ERROR')
      if (ee.stderr) {
        console.log(ee.stderr)
      } else {
        const data = JSON.parse(ee.stdout)
        if (data.error) {
          vscode.window.showErrorMessage(data.error)
        } else {
          console.log(ee)
          vscode.window.showErrorMessage(
            'Deeptest Exception ocurred. Please check the logs in the OUTPUT panel below.'
          )
        }
      }
    }
    return []
  }
}

export function deactivate(): void {}
