export enum Status {
  PASS,
  FAIL,
}

export interface RecentRun {
  status: Status
  reportId: string
}

export interface NodeMetadata {
  id: string
  status: Status
  durationMs: number
  recents: RecentRun[]
  date: string
}
export interface Node {
  meta: NodeMetadata
}

export interface InnerNode extends Node {
  children: NodeMetadata[]
}

export interface LeafNode extends Node {
  log: string
}

export function isLeafNode(node: InnerNode | LeafNode): node is LeafNode {
  return (node as LeafNode).log !== undefined
}
