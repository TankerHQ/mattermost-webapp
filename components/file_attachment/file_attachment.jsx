// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';

import {
    trimFilename,
} from 'utils/file_utils';
import {
    fileSizeToString,
} from 'utils/utils.jsx';

import DownloadIcon from 'components/svg/download_icon';

import FilenameOverlay from './filename_overlay.jsx';
import FileThumbnail from './file_thumbnail.jsx';

export default class FileAttachment extends React.PureComponent {
    static propTypes = {

        /*
         * File detailed information
         */
        fileInfo: PropTypes.object.isRequired,

        /*
         * The index of this attachment preview in the parent FileAttachmentList
         */
        index: PropTypes.number.isRequired,

        /*
         * Handler for when the thumbnail is clicked passed the index above
         */
        handleImageClick: PropTypes.func,

        /*
         * Display in compact format
         */
        compactDisplay: PropTypes.bool,

        canDownloadFiles: PropTypes.bool,
    };

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    onAttachmentClick = (e) => {
        e.preventDefault();
        if (this.props.handleImageClick) {
            this.props.handleImageClick(this.props.index);
        }
    }

    render() {
        const {
            compactDisplay,
            fileInfo,
        } = this.props;

        const trimmedFilename = trimFilename(fileInfo.name);
        let fileThumbnail;
        let fileDetail;
        if (!compactDisplay) {
            fileThumbnail = (
                <a
                    className='post-image__thumbnail'
                    href='#'
                    onClick={this.onAttachmentClick}
                >
                    <FileThumbnail fileInfo={fileInfo}/>
                </a>
            );

            fileDetail = (
                <div
                    className='post-image__detail_wrapper'
                    onClick={this.onAttachmentClick}
                >
                    <div className='post-image__detail'>
                        <span className={'post-image__name'}>
                            {trimmedFilename}
                        </span>
                        <span className='post-image__type'>{fileInfo.extension.toUpperCase()}</span>
                        <span className='post-image__size'>{fileSizeToString(fileInfo.size)}</span>
                    </div>
                </div>
            );
        }

        let filenameOverlay;
        if (this.props.canDownloadFiles) {
            filenameOverlay = (
                <FilenameOverlay
                    fileInfo={fileInfo}
                    compactDisplay={compactDisplay}
                    canDownload={this.props.canDownloadFiles}
                    handleImageClick={this.onAttachmentClick}
                    iconClass={'post-image__download'}
                >
                    <DownloadIcon/>
                </FilenameOverlay>
            );
        }

        return (
            <div className='post-image__column'>
                {fileThumbnail}
                <div className='post-image__details'>
                    {fileDetail}
                    {filenameOverlay}
                </div>
            </div>
        );
    }
}
