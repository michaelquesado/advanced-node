class PgConnection {
  private static instance?: PgConnection
  private constructor () {}

  public static getInstance (): PgConnection {
    if (this.instance === undefined) {
      this.instance = new PgConnection()
    }
    return this.instance
  }
}
describe('PgConnection', () => {
  it('should have only one instance', () => {
    const sut = PgConnection.getInstance()
    const sut2 = PgConnection.getInstance()

    expect(sut).toBe(sut2)
  })
})
