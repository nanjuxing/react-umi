import { Effect, Reducer, Subscription } from 'umi';
import { getRemoteList, editRecord, deleteRecord, addRecord } from './service'
import { message } from "antd"
import { SingleUserType } from './data.d'


export interface UserState {
    data: SingleUserType[],
    meta: {
        total: number;
        per_page: number;
        page: number;
    }
}

interface UserModelType {
    namespace: 'users';
    state: UserState;
    reducers: {
        getList: Reducer<UserState>;
    };
    effects: {
        getRemote: Effect,
        edit: Effect,
        delete: Effect,
        add: Effect
    };
    subscriptions: { setup: Subscription };
}
const UserModel: UserModelType = {
    namespace: "users",
    state: {
        data: [],
        meta: {
            total: 0,
            per_page: 5,
            page: 1,
        }
    },
    reducers: {
        getList(state, { payload }) {
            return payload
        }
    },
    effects: {
        *getRemote({ payload: { page, per_page } }, { put, call }) {

            const data = yield call(getRemoteList, { page, per_page })

            if (data) {
                message.success('获取数据成功')
                yield put({
                    type: 'getList',
                    payload: data
                })
            } else {
                message.error('获取数据失败')
            }

        },
        *edit({ payload: { id, values } }, { put, call, select }) {
            const data = yield call(editRecord, { id, values })
            if (data) {
                const { page, per_page } =yield select((state:any) => state.users.meta)
                yield put({
                    type: 'getRemote',
                    payload: {
                        page, per_page
                    }
                })
            } else {
                message.error('编辑数据失败')
            }

        },
        *delete({ payload: { id } }, { put, call, select }) {
            const data = yield call(deleteRecord, { id })
            if (data) {
                message.success('删除数据成功')
                const { page, per_page } =yield select((state:any) => state.users.meta)
                yield put({
                    type: 'getRemote',
                    payload: {
                        page, per_page
                    }
                })
            } else {
                message.error('删除数据失败')
            }

        },
        *add({ payload: { values } }, { put, call, select }) {
            const data = yield call(addRecord, { values })
            if (data) {
                const { page, per_page } =yield select((state :any)=> state.users.meta)
                
                yield put({
                    type: 'getRemote',
                    payload: {
                        page, per_page
                    }
                })
            } else {
                message.error('添加数据失败')
            }

        }
    },
    subscriptions: {
        setup({ dispatch, history }) {

            return history.listen(({ pathname }) => {
                if (pathname === '/users') {
                    dispatch({
                        type: 'getRemote',
                        payload: { page: 1, per_page: 5 }
                    })
                }
            })
        }
    }
}

export default UserModel;