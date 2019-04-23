import { readFileAsLines } from '../utils'
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
    await this.setDns(dnsList)
    this.addedNameservers = dnsList
  }

  /**
   * Saves current user's list of DNs addresses
   */
  async save() {
    this.savedResolvFileLines = await this.getDns()
    await this.saveDataToFile()
  }

  /**
   * Set's DNS list to currently saved lists
   */
  async recover() {
    await this.loadDataFromFile()
    await this.setDns([], this.savedResolvFileLines)
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
  async setDns(dnsList: string[], savedLines: string[] = []) {
    const fullFileLines = dnsList.map(ns => this.formatNs(ns)).concat(savedLines)
    const text = fullFileLines.join('\n')

    const { stderr, error, stdout } = await exec(
      `rm -f ${RESOLV_PATH} && echo ${text} > ${RESOLV_PATH}`
    )
  }

  /**
   * Fetches resolve conf
   *
   * @param networkInterface Network interface to read
   */
  async getDns() {
    return readFileAsLines(RESOLV_PATH)
  }

  formatNs(nameserver: string) {
    return `nameserver ${nameserver}`
  }
}
