// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {batchActions} from 'redux-batched-actions';
import request from 'superagent';
import {FileTypes} from 'mattermost-redux/action_types';
import {getLogErrorAction} from 'mattermost-redux/actions/errors';
import {forceLogoutIfNecessary} from 'mattermost-redux/actions/helpers';
import {Client4} from 'mattermost-redux/client';
import {decryptFile, encryptFile} from 'mattermost-redux/actions/tanker';
import FileReader from '@tanker/file-reader';

import * as Utils from 'utils/utils.jsx';

export function uploadFile(file, name, channelId, rootId, clientId) {
    return async (dispatch, getState) => {
        dispatch({type: FileTypes.UPLOAD_FILES_REQUEST});

        const encryptedFile = await encryptFile(dispatch, getState, file, channelId);

        const req = request.
            post(Client4.getFilesRoute()).
            set(Client4.getOptions({method: 'post'}).headers).
            attach('files', encryptedFile, name).
            field('channel_id', channelId).
            field('client_ids', clientId).
            accept('application/json');

        return () => req;
    };
}

export function downloadFile(url) {
    return async (dispatch, getState) => {
        dispatch({type: FileTypes.UPLOAD_FILES_REQUEST});

        const response = await fetch(url);
        const encryptedFile = await response.blob();

        return decryptFile(dispatch, getState, encryptedFile);
    };
}

export function downloadFileAsDataURL(url) {
    return async (dispatch, getState) => {
        const file = await downloadFile(url)(dispatch, getState);
        const reader = new FileReader(file);
        return reader.readAsDataURL();
    };
}

export function handleFileUploadEnd(file, name, channelId, rootId, clientId, {err, res}) {
    return (dispatch, getState) => {
        if (err) {
            let e;
            if (res && res.body && res.body.id) {
                e = res.body;
            } else if (err.status === 0 || !err.status) {
                e = {message: Utils.localizeMessage('channel_loader.connection_error', 'There appears to be a problem with your internet connection.')};
            } else {
                e = {message: Utils.localizeMessage('channel_loader.unknown_error', 'We received an unexpected status code from the server.') + ' (' + err.status + ')'};
            }

            forceLogoutIfNecessary(err, dispatch, getState);

            const failure = {
                type: FileTypes.UPLOAD_FILES_FAILURE,
                clientIds: [clientId],
                channelId,
                rootId,
                error: err,
            };

            dispatch(batchActions([failure, getLogErrorAction(err)]));
            return {error: e};
        }
        const data = res.body.file_infos.map((fileInfo, index) => {
            return {
                ...fileInfo,
                clientId: res.body.client_ids[index],
            };
        });

        dispatch(batchActions([
            {
                type: FileTypes.RECEIVED_UPLOAD_FILES,
                data,
                channelId,
                rootId,
            },
            {
                type: FileTypes.UPLOAD_FILES_SUCCESS,
            },
        ]));

        return {data: res.body};
    };
}
