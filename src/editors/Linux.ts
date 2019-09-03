import { readFileAsLines, readlinkAsync, escapeRegExp } from '../utils'
import { Editor } from './Editor'
import { exec } from 'exec-root'
const RESOLV_PATH = '/etc/resolv.conf'

export class LinuxEditor extends Editor {
  constructor(name: string = 'DefaultDns') {
    super(name)
  }

  /**
   * Sets current network interface's DNS
   *
   * @param dnsList List of new DNS addresses to apply
   */
  async load(dnsList: string[]) {
    await this.setDns(dnsList, this.savedResolvFileLines)
    this.addedNameservers = dnsList
  }

  /**
   * Saves current user's list of DNs addresses
   */
  async save() {
    this.savedResolvFileLines = await this.getDns()

    try {
      this.savedResolvSymlink = await readlinkAsync(RESOLV_PATH, 'utf8')
    } catch (e) {
      console.log(e)
    }

    await this.saveDataToFile()
  }

  /**
   * Set's DNS list to currently saved lists
   */
  async recover() {
    await this.loadDataFromFile()
    await this.setDns([], this.savedResolvFileLines, this.savedResolvSymlink)
  }

  /**
   * Check if name server exists
   *
   * @param nameserver Name of the nameserver to find if exists
   */
  async exists(nameserver: string) {
    const currentResolvLines = await this.getDns()
    const formattedNs = this.formatNs(nameserver)
    return currentResolvLines.find(ns => ns === formattedNs)
  }

  /**
   * Updates the list of DNS addresses for a particular network interface
   *
   * @param networkInterface Network interface to update
   * @param dnsList List of DNS addresses to set
   */
  async setDns(dnsList: string[], savedLines: string[] = [], savedResolvSymlink: string = '') {
    const fullFileLines = dnsList.map(ns => this.formatNs(ns)).concat(savedLines)
    const text = fullFileLines.join('\n')

    const command =
      savedResolvSymlink !== ''
        ? `ln -s ${savedResolvSymlink} ${RESOLV_PATH}`
        : `tee ${RESOLV_PATH} <<< '${escapeRegExp(text)}'`

    console.log('Setting DNS')
    console.log(`Symlink: ${savedResolvSymlink}`)
    console.log(`Command: bash -c "rm -f ${RESOLV_PATH}; ${command};"`)

    await exec(`bash -c "rm -f ${RESOLV_PATH}; ${command};"`, { name: this.appName })
  }

  /**
   * Fetches resolve conf
   *
   * @param networkInterface Network interface to read
   */
  async getDns() {
    console.log('Get DNS')
    console.log(await readFileAsLines(RESOLV_PATH))

    return readFileAsLines(RESOLV_PATH)
  }

  formatNs(nameserver: string) {
    return `nameserver ${nameserver}`
  }
}
