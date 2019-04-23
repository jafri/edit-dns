import { nonSudoExec } from '../utils'
import { Editor } from './Editor'

export class WindowsEditor extends Editor {
  constructor(name: string = 'DefaultDns') {
    super(name)
  }

  /**
   *
   * @param dnsList List of new DNS addresses to apply
   */
  async load(dnsList: string[]) {
    await this.updateNetworkInterface()
    await this.setDns(this.networkInterface, dnsList)

    this.addedNameservers = dnsList
    await this.saveDataToFile()
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
    await this.loadDataFromFile()
    await this.removeDns(this.networkInterface, this.addedNameservers)
  }

  /**
   * Check if name server exists
   *
   * @param nameserver Name of the nameserver to find if exists
   */
  async exists(nameserver: string) {
    const fullConfigLines = await this.getDns(this.networkInterface)
    const regexp = new RegExp(nameserver)
    return fullConfigLines.find(line => regexp.test(line))
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

    console.log('Get DNS:', stdout)
    if (stdout) {
      return stdout.split('\r\n').filter(line => line)
    } else {
      return []
    }
  }

  /**
   * Get current network interface
   */
  async getNetworkInterface() {
    const { stdout, stderr } = await nonSudoExec(`netsh interface show interface`)
    console.log('Netint stdout:', stdout)
    console.log('Netint stderr:', stderr)
    const results = stdout
      .split('\r\n')
      .filter(line => line)
      .map(line => line.split(/\s+/))

    console.log('Netint results:', results)

    const resultInterface = results.find(
      result => result.length === 4 && result[0] === 'Enabled' && result[1] === 'Connected'
    ) || ['', '', '', '']

    console.log('Netint resultInterface:', resultInterface)

    return resultInterface[3]
  }
}
