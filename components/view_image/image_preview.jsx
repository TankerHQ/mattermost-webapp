// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {getFilePreviewUrl, getFileDownloadUrl, getFileUrl} from 'mattermost-redux/utils/file_utils';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {downloadFileAsDataURL} from 'actions/file_actions';

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            downloadFileAsDataURL,
        }, dispatch),
    };
}

class ImagePreview extends React.PureComponent {
    static propTypes = {
        fileInfo: PropTypes.object.isRequired,
        canDownloadFiles: PropTypes.bool.isRequired,
        actions: PropTypes.shape({
            downloadFileAsDataURL: PropTypes.func.isRequired,
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
        const dataURL = await this.props.actions.downloadFileAsDataURL(fileURL);

        if (this.imageLoaded) {
            this.imageLoaded.src = dataURL;
        }
    }

    render = () => {
        const {fileInfo, canDownloadFiles} = this.props;
        const {id, link} = fileInfo;
        const fileUrl = link || getFileDownloadUrl(id);

        if (!canDownloadFiles) {
            return <img ref={this.setImageLoadedRef}/>;
        }

        return (
            <a
                href={fileUrl}
                target='_blank'
                rel='noopener noreferrer'
                download={true}
            >
                <img ref={this.setImageLoadedRef}/>
            </a>
        );
    }
}

export default connect(() => ({}), mapDispatchToProps)(ImagePreview);
