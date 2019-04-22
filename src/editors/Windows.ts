import { nonSudoExec } from '../utils'
import { Editor } from './Editor'

export class WindowsEditor extends Editor {
  /**
   *
   * @param dnsList List of new DNS addresses to apply
   */
  async load(dnsList: string[]) {
    this.savedNameservers = dnsList
    await this.updateNetworkInterface()
    await this.setDns(this.networkInterface, dnsList)
  }

  /**
   * Saves current user's list of DNs addresses
   */
  async save() {
    // Doesn't do anything
  }

  /**
   * Set's DNS list to currently saved list
   */
  async recover() {
    await this.removeDns(this.networkInterface, this.savedNameservers)
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
    let idx = 1
    for (const ns of dnsList) {
      await nonSudoExec(
        `netsh interface ipv4 add dnsservers name="${networkInterface}" ${ns} index=${idx} validate=no`
      )
      idx++
    }
  }

  /**
   * Deletes the list of DNS addresses for a particular network interface
   *
   * @param networkInterface Network interface to update
   * @param dnsList List of DNS addresses to set
   */
  async removeDns(networkInterface: string, dnsList: string[]) {
    for (const ns of dnsList) {
      await nonSudoExec(
        `netsh interface ipv4 delete dnsservers name="${networkInterface}" ${ns} validate=no`
      )
    }
  }

  /**
   * Fetches list of DNS addresses
   *
   * @param networkInterface Network interface to read
   */
  async getDns(networkInterface: string): Promise<string[]> {
    const { stdout } = await nonSudoExec(`netsh interface ipv4 show config`)

    if (stdout) {
      return stdout.split('\n').filter(line => line)
    } else {
      return []
    }
  }

  /**
   * Get current network interface
   */
  async getNetworkInterface() {
    const { stdout } = await nonSudoExec(`netsh interface show interface`)
    const results = stdout
      .split('\n')
      .filter(line => line)
      .map(line => line.split('\t'))
    const resultInterface = results.find(
      result => result.length === 4 && result[0] === 'Enabled' && result[1] === 'Connected'
    ) || ['', '', '', '']
    return resultInterface[3]
  }
}
