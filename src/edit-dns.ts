import { MacosEditor, WindowsEditor, LinuxEditor } from './editors'

let editor: any
if (process.platform === 'darwin') {
  editor = new MacosEditor()
} else if (process.platform === 'win32') {
  editor = new WindowsEditor()
} else if (process.platform === 'linux') {
  editor = new LinuxEditor()
} else {
  console.error('Only Macos, Windows and Linux supported.')
}

export default editor
