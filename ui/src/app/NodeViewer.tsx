import {
  InnerNode,
  isLeafNode,
  LeafNode,
  NodeMetadata,
  RecentRun,
  Status,
} from './common'

const StatusIcon = ({ status }: { status: Status }) => {
  return <div>{status === Status.PASS ? 'P' : 'F'}</div>
}

const Recents = ({ recents }: { recents: RecentRun[] }) => {
  if (recents.length === 0) {
    return <div>None</div>
  }
  return (
    <div>
      {recents.map((r) => (
        <StatusIcon key={r.reportId} status={r.status} />
      ))}
    </div>
  )
}

const ChildNodeRow = ({ data }: { data: NodeMetadata }) => {
  return (
    <div style={{ display: 'flex' }}>
      <StatusIcon status={data.status} /> {data.id} {data.durationMs}ms {''}
      <Recents recents={data.recents} />{' '}
    </div>
  )
}

const NodeDataViewer = ({ node }: { node: InnerNode | LeafNode }) => {
  if (isLeafNode(node)) {
    return <pre>{node.log}</pre>
  }
  return (
    <div>
      {node.children.map((cc) => (
        <ChildNodeRow data={cc} />
      ))}
    </div>
  )
}

export const NodeViewer = ({
  branch,
  node,
}: {
  branch: string
  node: InnerNode | LeafNode
}) => {
  return (
    <div>
      <div style={{ margin: 10, padding: 5 }}>
        <div style={{ fontWeight: 'bold' }}>
          {branch} {node.meta.id}
        </div>
        <div style={{ display: 'flex' }}>
          <StatusIcon status={node.meta.status} /> Submitted {node.meta.date},
          recent results: <Recents recents={node.meta.recents} />
        </div>
      </div>
      <div
        style={{
          margin: 10,
          padding: 5,
          border: '1px solid rgba(0,0,0, 0.25)',
          borderRadius: 5,
        }}
      >
        <NodeDataViewer node={node} />
      </div>
    </div>
  )
}
