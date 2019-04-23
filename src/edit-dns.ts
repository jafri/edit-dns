import { MacosEditor, WindowsEditor, LinuxEditor } from './editors'

let editor: any
if (process.platform === 'darwin') {
  editor = MacosEditor
} else if (process.platform === 'win32') {
  editor = WindowsEditor
} else if (process.platform === 'linux') {
  editor = LinuxEditor
} else {
  console.error('Only Macos, Windows and Linux supported.')
}

export default editor
