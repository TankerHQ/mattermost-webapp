// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {getFilePreviewUrl, getFileUrl} from 'mattermost-redux/utils/file_utils';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import FileReader from '@tanker/file-reader';
import saveToDisk from 'file-saver';

import {downloadFile} from 'actions/file_actions';

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            downloadFile,
        }, dispatch),
    };
}

class ImagePreview extends React.PureComponent {
    static propTypes = {
        fileInfo: PropTypes.object.isRequired,
        canDownloadFiles: PropTypes.bool.isRequired,
        actions: PropTypes.shape({
            downloadFile: PropTypes.func.isRequired,
        }).isRequired,
    };

    componentDidMount() {
        this.loadImage(this.props.fileInfo);
    }

    UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
        this.loadImage(nextProps.fileInfo);
    }

    setImageLoadedRef = (node) => {
        this.imageLoaded = node;
    }

    loadImage = async (fileInfo) => {
        const {has_preview_image: hasPreviewImage, id} = fileInfo;
        const fileURL = hasPreviewImage ? getFilePreviewUrl(id) : getFileUrl(id);
        const file = await this.props.actions.downloadFile(fileURL);
        const fileReader = new FileReader(file);
        const dataURL = await fileReader.readAsDataURL();

        if (this.imageLoaded) {
            this.imageFile = file;
            this.imageLoaded.src = dataURL;
        }
    }

    onDownload = (e) => {
        e.preventDefault();
        const filename = this.props.fileInfo.link || this.props.fileInfo.name;
        saveToDisk(this.imageFile, filename);
    }

    render = () => {
        const {canDownloadFiles} = this.props;

        if (!canDownloadFiles) {
            return <img ref={this.setImageLoadedRef}/>;
        }

        return (
            <a
                href='#'
                rel='noopener noreferrer'
                onClick={this.onDownload}
            >
                <img ref={this.setImageLoadedRef}/>
            </a>
        );
    }
}

export default connect(() => ({}), mapDispatchToProps)(ImagePreview);
