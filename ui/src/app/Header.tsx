import { PAGE_CONTENT_WIDTH } from './Constants'

export const Header = ({ repo }: { repo: string }) => {
  return (
    <div
      style={{
        backgroundColor: '#4F0961',
        margin: 0,
        height: 62,
        display: 'flex',
      }}
    >
      <div
        style={{
          color: 'white',
          fontSize: '32px',
          opacity: 0.88,
          position: 'absolute',
          marginTop: 12,
          marginLeft: 20,
        }}
      >
        Deeptest
      </div>
      <div
        style={{
          color: 'white',
          fontSize: '32px',
          width: PAGE_CONTENT_WIDTH,
          margin: 'auto',
        }}
      >
        {repo}
      </div>
    </div>
  )
}
