import React from 'react'
import { Header } from './Header'
import { Helmet } from 'react-helmet'
import { PAGE_CONTENT_WIDTH } from './Constants'
import { NodeViewer } from './NodeViewer'
import { InnerNode, LeafNode, Status } from './common'

export const App = () => {
  const lnode: LeafNode = {
    meta: {
      id:
        'whaler / unit-tests.xml : user_handler . tests . test_users . TestAPIjwt',
      status: Status.PASS,
      durationMs: 34,
      recents: [
        {
          reportId: '98',
          status: Status.PASS,
        },
      ],
      date: 'YYYY-MM-DDTHH:mm:ss. sssZ',
    },
    log: 'blah',
  }
  const inode: InnerNode = {
    meta: {
      id: 'whaler / unit-tests.xml : user_handler . tests',
      status: Status.FAIL,
      durationMs: 1900,
      recents: [
        {
          reportId: '98',
          status: Status.PASS,
        },
      ],
      date: 'YYYY-MM-DDTHH:mm:ss. sssZ',
    },
    children: [lnode.meta, lnode.meta, lnode.meta],
  }

  return (
    <div>
      {' '}
      <Helmet>
        <style>{'body { margin: 0; }'}</style>
      </Helmet>
      <Header repo={'whaler'}></Header>
      <div
        style={{
          width: PAGE_CONTENT_WIDTH,
          margin: 'auto',
        }}
      >
        <NodeViewer branch="master" node={inode} />
      </div>
    </div>
  )
}
