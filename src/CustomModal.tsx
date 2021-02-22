import { ReactElement } from 'react';
import { X } from 'react-feather';
import Modal from 'react-modal';
import { media, style } from 'typestyle';

import { Colors, mobile } from './util';

const containerStyle = style(
  { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 20 },
  media(mobile, { padding: 0 })
);

export function CustomModal(props: { modalOptions: ReactModal.Props; title: string; children: ReactElement }) {
  // Shared modal options
  const modalOptions = {
    style: {
      content: {
        maxHeight: 'calc(95vh - 40px)',
        background: Colors.Black,
        top: '50%',
        left: '52%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-46%',
        transform: 'translate(-52%, -50%)',
      },
      overlay: { background: 'rgba(26,23,23,0.95)' },
    },
    bodyOpenClassName: 'modal-open',
    appElement: document.querySelector('.App') || undefined,
  };

  return (
    <Modal {...props.modalOptions} {...modalOptions}>
      <div className={containerStyle}>
        <X onClick={props.modalOptions.onRequestClose} style={{ position: 'absolute', top: 14, right: 14, cursor: 'pointer' }} />

        <h2 style={{ marginTop: 0, textAlign: 'center' }}>{props.title}</h2>

        {props.children}
      </div>
    </Modal>
  );
}
