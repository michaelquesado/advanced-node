import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { DbTransaction } from '@/application/contracts'

export class DbTransactionController extends Controller {
  constructor (
    private readonly decoratee: Controller,
    private readonly db: DbTransaction
  ) {
    super()
  }

  async perform (httpRequest: any): Promise<HttpResponse> {
    try {
      await this.db.openTransaction()
      const response = await this.decoratee.perform(httpRequest)
      await this.db.commit()
      return response
    } catch (error) {
      await this.db.rollback()
      throw error
    } finally {
      await this.db.closeTransaction()
    }
  }
}
