import DnsEditor from '../src/edit-dns'

/**
 * Read test
 */
describe('Read DNS Test', () => {
  if (process.platform === 'darwin') {
    it('Fetches network interface', async () => {
      await DnsEditor.updateNetworkInterface()
      expect(DnsEditor.networkInterface).toBeTruthy
    })
  }

  it('Saves current DNS', async () => {
    await DnsEditor.save()
  })

  it('Loads new DNS', async () => {
    await DnsEditor.load(['1.1.1.1'])
  })

  it('Recovers Default DNS', async () => {
    await DnsEditor.recover()
  })
})
