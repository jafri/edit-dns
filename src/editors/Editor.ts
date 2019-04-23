import { readFileAsync, writeFileAsync, mkkdirRecursive } from '../utils'
import envPaths from '../paths'
import * as path from 'path'
import { existsSync } from 'fs'

const paths = envPaths('MyApp')

export class Editor {
  [key: string]: any

  addedNameservers: string[] = []
  savedNameservers: string[] = []
  savedResolvFileLines: string[] = []
  networkInterface: string = ''
  appName: string = ''
  dataPath: string = ''

  constructor(name: string = 'DefaultDns') {
    this.appName = name
    this.dataPath = path.join(paths.data, `${this.appName}.json`)
  }

  async saveDataToFile() {
    if (!existsSync(paths.data)) {
      mkkdirRecursive(paths.data)
    }

    const data = JSON.stringify(
      {
        addedNameservers: this.addedNameservers,
        savedNameservers: this.savedNameservers,
        savedResolvFileLines: this.savedResolvFileLines,
        networkInterface: this.networkInterface,
        appName: this.appName
      },
      null,
      2
    )

    await writeFileAsync(this.dataPath, data, 'utf-8')
  }

  async loadDataFromFile() {
    if (!existsSync(this.dataPath)) {
      return
    }

    const data = JSON.parse(await readFileAsync(this.dataPath, 'utf-8'))

    for (const [key, value] of Object.entries(data)) {
      this[key] = value
    }
  }
}
