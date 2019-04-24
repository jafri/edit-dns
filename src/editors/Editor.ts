import { readFileAsync, writeFileAsync, mkkdirRecursive, unlinkAsync, existsAsync } from '../utils'
import envPaths from '../paths'
import * as path from 'path'

export class Editor {
  [key: string]: any

  addedNameservers: string[] = []
  savedNameservers: string[] = []
  savedResolvFileLines: string[] = []
  savedResolvSymlink: string = ''
  networkInterface: string = ''
  appName: string = ''
  dataPath: string = ''

  constructor(name: string = 'DefaultDns') {
    this.appName = name
    this.paths = envPaths(name)
    this.dataPath = path.join(this.paths.data, `${name}.json`)
  }

  async saveDataToFile() {
    if (!this.dataFileExists()) {
      mkkdirRecursive(this.paths.data)
    }

    const data = JSON.stringify(
      {
        pid: process.pid,
        addedNameservers: this.addedNameservers,
        savedNameservers: this.savedNameservers,
        savedResolvFileLines: this.savedResolvFileLines,
        savedResolvSymlink: this.savedResolvSymlink,
        networkInterface: this.networkInterface,
        appName: this.appName
      },
      null,
      2
    )

    await writeFileAsync(this.dataPath, data, 'utf-8')
  }

  async loadDataFromFile() {
    if (!this.dataFileExists()) return

    const data = JSON.parse(await readFileAsync(this.dataPath, 'utf-8'))

    for (const [key, value] of Object.entries(data)) {
      this[key] = value
    }
  }

  async deleteDataFile() {
    if (!this.dataFileExists()) return

    await unlinkAsync(this.dataPath)
  }

  async dataFileExists() {
    return await existsAsync(this.dataPath)
  }
}
