/** @jsxImportSource theme-ui */

import { useState } from 'react';
import { useSettingsContext } from '../../contexts/settingsContext';

// Components
import Button from '../Button';
import GoBack from '../Button/GoBack';
import Screen from '../Screen/Screen';

const NodeSettings = ({ onClose }: { onClose: () => void }) => {
  const { node, setNode } = useSettingsContext();
  const [newNode, setNewNode] = useState(node);
  const [updated, setUpdated] = useState(false);

  return (
    <Screen>
      <GoBack onClick={onClose} styles={{ pt: 2 }} />
      <h1>Set your node</h1>
      <input
        type="text"
        value={newNode}
        onChange={(e) => setNewNode(String(e.currentTarget.value))}
      />
      <Button
        styles={
          updated
            ? { ':hover': {}, cursor: 'default', backgroundColor: 'mint' }
            : {}
        }
        onClick={() => {
          if (!updated) {
            setNode(newNode);
            setUpdated(true);

            setTimeout(() => setUpdated(false), 2000);
          }
        }}
      >
        {updated ? 'Updated node settings!' : 'Set node'}
      </Button>
    </Screen>
  );
};

export default NodeSettings;
