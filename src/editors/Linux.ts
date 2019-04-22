import { readFileAsLines, writeFileFromLines } from '../utils'
import { Editor } from './Editor'

const RESOLV_PATH = '/etc/resolv.conf'

export class LinuxEditor extends Editor {
  /**
   * Sets current network interface's DNS
   *
   * @param dnsList List of new DNS addresses to apply
   */
  async load(dnsList: string[]) {
    await this.setDns(dnsList)
  }

  /**
   * Saves current user's list of DNs addresses
   */
  async save() {
    this.savedResolvFileLines = await this.getDns()
  }

  /**
   * Set's DNS list to currently saved list
   */
  async recover() {
    await this.setDns([], this.savedResolvFileLines)
  }

  /**
   * Updates the list of DNS addresses for a particular network interface
   *
   * @param networkInterface Network interface to update
   * @param dnsList List of DNS addresses to set
   */
  async setDns(dnsList: string[], savedLines: string[] = []) {
    const fullFileLines = dnsList.map(savedNs => `nameserver ${savedNs}`).concat(savedLines)

    await writeFileFromLines(RESOLV_PATH, fullFileLines)
  }

  /**
   * Fetches resolve conf
   *
   * @param networkInterface Network interface to read
   */
  async getDns() {
    return readFileAsLines(RESOLV_PATH)
  }
}
