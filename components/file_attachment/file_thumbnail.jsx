// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';

import {
    getFileType,
    getIconClassName,
} from 'utils/utils.jsx';

export default class FileThumbnail extends React.PureComponent {
    static propTypes = {

        /*
         * File detailed information
         */
        fileInfo: PropTypes.object.isRequired,
    }

    render() {
        const {fileInfo} = this.props;
        const type = getFileType(fileInfo.extension);
        return <div className={'file-icon ' + getIconClassName(type)}/>;
    }
}
