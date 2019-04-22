import { nonSudoExec } from '../utils'
import { Editor } from './Editor'

export class WindowsEditor extends Editor {
  /**
   *
   * @param dnsList List of new DNS addresses to apply
   */
  async load(dnsList: string[]) {
    await this.updateNetworkInterface()
    await this.setDns(this.networkInterface, dnsList)
  }

  /**
   * Saves current user's list of DNs addresses
   */
  async save() {
    await this.updateNetworkInterface()
    this.savedNameservers = await this.getDns(this.networkInterface)
  }

  /**
   * Set's DNS list to currently saved list
   */
  async recover() {
    await this.load(this.savedNameservers)
  }

  /**
   * Fetches the current network interface and updates class object
   */
  async updateNetworkInterface() {
    this.networkInterface = await this.getNetworkInterface()
  }

  /**
   * Updates the list of DNS addresses for a particular network interface
   *
   * @param networkInterface Network interface to update
   * @param dnsList List of DNS addresses to set
   */
  async setDns(networkInterface: string, dnsList: string[]) {
    const joinedDnsList = dnsList.length ? dnsList.join(' ') : 'empty'
    return nonSudoExec(`networksetup -setdnsservers "${networkInterface}" ${joinedDnsList}`)
  }

  /**
   * Fetches list of DNS addresses
   *
   * @param networkInterface Network interface to read
   */
  async getDns(networkInterface: string): Promise<string[]> {
    const { stdout } = await nonSudoExec(`networksetup -getdnsservers "${networkInterface}"`)

    if (stdout && !/'/.test(stdout)) {
      return stdout.split('\n').filter(line => line)
    } else {
      return []
    }
  }

  /**
   * Get current network interface
   */
  async getNetworkInterface() {
    const { stdout } = await nonSudoExec(
      `networksetup -listnetworkserviceorder | grep $(route get example.com | grep interface | awk '{print $2}') | awk 'gsub(/.*Hardware Port: |,.*/,"")'`
    )
    return stdout.trim()
  }
}
