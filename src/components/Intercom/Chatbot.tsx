import React from 'react';
import Intercom from '@intercom/messenger-js-sdk';

export default function Chatbot() {
    Intercom({
        app_id: 'h5ae5mrb',
    });

    return <div>Example App</div>;
}