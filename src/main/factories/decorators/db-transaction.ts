import { Controller } from '@/application/controllers'
import { DbTransactionController } from '@/application/decorators'
import { makePgConnection } from '../repos/helpers'

export const makeDbTransactionController = (controller: Controller): DbTransactionController => {
  return new DbTransactionController(controller, makePgConnection())
}
