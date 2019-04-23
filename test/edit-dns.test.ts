import DnsEditor from '../src/edit-dns'

const APP_NAME = 'TestApp'

/**
 * Read test
 */
describe('Read DNS Test', () => {
  const dnsEditor = new DnsEditor(APP_NAME)

  if (process.platform === 'darwin' || process.platform === 'win32') {
    it('Fetches network interface', async () => {
      await dnsEditor.updateNetworkInterface()
      expect(dnsEditor.networkInterface).toBeTruthy()
    })
  }

  it('Saves current DNS', async () => {
    await dnsEditor.save()
  })

  it('Loads new DNS', async () => {
    await dnsEditor.load(['1.1.1.1'])
  })

  it('Check new DNS exists', async () => {
    const exists = await dnsEditor.exists('1.1.1.1')
    expect(exists).toBeTruthy()
  })

  it('Recovers Default DNS', async () => {
    await dnsEditor.recover()
  })

  it('Check new DNS was removed', async () => {
    const exists = await dnsEditor.exists('1.1.1.1')
    expect(exists).toBeFalsy()
  })
})
