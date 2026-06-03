import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Blockquote, Paragraph, Text } from 'mdast';

/**
 * Remark plugin to support custom alert types beyond GitHub's standard alerts
 * Handles: REFERENCE and EXAMPLE
 */
const remarkCustomAlerts: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'blockquote', (node: Blockquote, index, parent) => {
      // Check if this is a blockquote with alert syntax
      const firstChild = node.children[0];
      if (firstChild?.type !== 'paragraph') return;

      const paragraph = firstChild as Paragraph;
      const firstText = paragraph.children[0];
      if (firstText?.type !== 'text') return;

      const text = (firstText as Text).value;
      const alertMatch = text.match(/^\[!(REFERENCE|EXAMPLE)\]\s*/);

      if (alertMatch && alertMatch[1]) {
        const alertType = alertMatch[1] as 'REFERENCE' | 'EXAMPLE';

        // Remove the alert marker from the text
        (firstText as Text).value = text.replace(/^\[!(REFERENCE|EXAMPLE)\]\s*/, '');

        // Add data attributes to the blockquote for styling
        if (!node.data) {
          node.data = {};
        }
        if (!node.data.hProperties) {
          node.data.hProperties = {};
        }

        // GitHub-compatible class names
        (node.data.hProperties as any)['data-alert-type'] = alertType.toLowerCase();
        (node.data.hProperties as any).className = [
          'markdown-alert',
          `markdown-alert-${alertType.toLowerCase()}`
        ].join(' ');
      }
    });
  };
};

export default remarkCustomAlerts;
