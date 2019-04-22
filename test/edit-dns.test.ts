import DnsEditor from '../src/edit-dns'

/**
 * Read test
 */
describe('Read DNS Test', () => {
  if (process.platform === 'darwin' || process.platform === 'win32') {
    it('Fetches network interface', async () => {
      await DnsEditor.updateNetworkInterface()
      expect(DnsEditor.networkInterface).toBeTruthy()
    })
  }

  it('Saves current DNS', async () => {
    await DnsEditor.save()
  })

  it('Loads new DNS', async () => {
    await DnsEditor.load(['1.1.1.1'])
  })

  it('Check new DNS exists', async () => {
    const exists = await DnsEditor.exists('1.1.1.1')
    expect(exists).toBeTruthy()
  })

  it('Recovers Default DNS', async () => {
    await DnsEditor.recover()
  })

  it('Check new DNS was removed', async () => {
    const exists = await DnsEditor.exists('1.1.1.1')
    expect(exists).toBeFalsy()
  })
})
