import { BaseResp } from './BaseResp'
import { DetailPerson, Person } from './Person'

export interface DetailResp extends BaseResp {
    data: {
        self: DetailPerson[]
        parents: Person[]
        childs: Person[]
    }
}