// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { downloadFile } from 'actions/file_actions';
import {isDesktopApp} from 'utils/user_agent.jsx';

import PopoverBar from './popover_bar.jsx';

function mapStateToProps() {
    return {
        isDesktopApp: isDesktopApp(),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            downloadFile,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopoverBar);
