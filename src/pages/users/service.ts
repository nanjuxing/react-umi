import request, { extend } from "umi-request"
import { message } from 'antd'
import { FormValues } from "./data";

const errorHandler = function (error: any) {
    const codeMap = {
        '021': 'An error has occurred',
        '022': 'It’s a big mistake,',
        // ....
    };
    if (error.response) {
        if (error.response.status > 400) {
            message.error(error.data.message ? error.data.message : error.data)
        }
    } else {
        // The request was made but no response was received or error occurs when setting up the request.
        console.log('Network Error');
    }

    throw error; // If throw. The error will continue to be thrown.

    // return {some: 'data'}; If return, return the value as a return. If you don't write it is equivalent to return undefined, you can judge whether the response has a value when processing the result.
    // return {some: 'data'};
};

// 1. Unified processing
const extendRequest = extend({ errorHandler });


export const getRemoteList = async ({ page, per_page }: { page: number, per_page: number }) => {
    console.log(page, per_page);

    return extendRequest(`api/users?page=${page}&per_page=${per_page}`, {
        method: 'get',
    }).then(function (response) {
        console.log(response);

        return response
    }).catch(function (error) {
        return false

    })
}

export const editRecord = async ({ id, values }: { id: number, values: FormValues }) => {
    return extendRequest(`api/users/${id}`, {
        method: 'put',
        data: values
    }).then(function (response) {

        return true
    }).catch(function (error) {
        return false

    })
}

export const deleteRecord = async ({ id }: { id: number }) => {
    return extendRequest(`api/users/${id}`, {
        method: 'delete',
    }).then(function (response) {

        return true
    }).catch(function (error) {
        return false

    })
}
export const addRecord = async ({ values }: { values: FormValues }) => {
    return extendRequest(`api/users`, {
        method: 'post',
        data: values
    }).then(function (reponse) {

        return true
    }).catch(function (error) {
        return false

    })
}