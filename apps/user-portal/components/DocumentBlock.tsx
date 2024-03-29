import { FC } from 'react';
import {
  DocumentRenderer,
  DocumentRendererProps,
} from '@keystone-6/document-renderer';
// eslint-disable-next-line import/no-named-default
import { default as _ReactPlayer } from 'react-player';
import { ReactPlayerProps } from 'react-player/types/lib';

const renderers: DocumentRendererProps['renderers'] = {
  // use your editor's autocomplete to see what other renderers you can override
  inline: {
    bold: ({ children }) => <strong>{children}</strong>,
  },
  block: {
    paragraph: ({ children, textAlign }) => (
      <p style={{ textAlign }}>{children}</p>
    ),
  },
};

const componentBlockRenderers: DocumentRendererProps['componentBlocks'] = {
  quote: (props) => (
    <div
      style={{
        borderLeft: '3px solid #CBD5E0',
        paddingLeft: 16,
      }}
    >
      <div style={{ fontStyle: 'italic', color: '#4A5568' }}>
        {props.content}
      </div>
      <div style={{ fontWeight: 'bold', color: '#718096' }}>
        — {props.attribution}
      </div>
    </div>
  ),
  video: (props) => {
    const { url } = props;
    const ReactPlayer = _ReactPlayer as unknown as FC<ReactPlayerProps>;

    return (
      <div contentEditable={false}>
        <div
          style={{
            padding: '0 0 0 0',
            position: 'relative',
          }}
        >
          <ReactPlayer url={url} />
        </div>
      </div>
    );
  },
};

export function DocumentBlock({ ...props }) {
  return (
    <DocumentRenderer
      {...props}
      document={props.document}
      renderers={renderers}
      componentBlocks={componentBlockRenderers}
    />
  );
}
