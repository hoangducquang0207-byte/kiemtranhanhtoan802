/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
}

export default function MathText({ text }: MathTextProps) {
  if (!text) return null;

  try {
    const parts: React.ReactNode[] = [];
    const blockParts = text.split(/(\$\$.*?\$\$)/gs);

    blockParts.forEach((part, blockIdx) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const formula = part.slice(2, -2);
        try {
          const html = katex.renderToString(formula, { displayMode: true, throwOnError: false });
          parts.push(
            <span
              key={`block-${blockIdx}`}
              className="my-3 block overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          parts.push(<pre key={`block-err-${blockIdx}`} className="bg-red-50 p-1 text-slate-500 rounded">{part}</pre>);
        }
      } else {
        const inlineParts = part.split(/(\$.*?\$)/g);
        inlineParts.forEach((subPart, inlineIdx) => {
          if (subPart.startsWith('$') && subPart.endsWith('$')) {
            const formula = subPart.slice(1, -1);
            try {
              const html = katex.renderToString(formula, { displayMode: false, throwOnError: false });
              parts.push(
                <span
                  key={`inline-${blockIdx}-${inlineIdx}`}
                  className="mx-0.5 inline-block align-middle"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              );
            } catch {
              parts.push(<span key={`inline-err-${blockIdx}-${inlineIdx}`} className="bg-red-50 p-0.5 text-slate-500 rounded">{subPart}</span>);
            }
          } else {
            if (subPart.includes('<br>')) {
              const brParts = subPart.split('<br>');
              brParts.forEach((brPart, brIdx) => {
                parts.push(<span key={`text-${blockIdx}-${inlineIdx}-${brIdx}`}>{brPart}</span>);
                if (brIdx < brParts.length - 1) {
                  parts.push(<br key={`br-${blockIdx}-${inlineIdx}-${brIdx}`} />);
                }
              });
            } else {
              parts.push(<span key={`text-${blockIdx}-${inlineIdx}`}>{subPart}</span>);
            }
          }
        });
      }
    });

    return <span className="inline-block w-full">{parts}</span>;
  } catch (error) {
    console.error('KaTeX rendering error: ', error);
    return <span>{text}</span>;
  }
}
