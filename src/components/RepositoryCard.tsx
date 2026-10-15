import { formatCount } from '../utils/formatCount'

interface RepositoryCardProps {
  name: string
  description: string | null
  stars: number
  forks: number
  language: string | null
  url: string
}

function RepositoryCard({ name, description, stars, forks, language, url }: RepositoryCardProps) {
  return (
    <article className="repository-card">
      <div className="card-top">
        <span className="repo-icon" aria-hidden="true">▤</span>
        <span className="public-badge">Public</span>
      </div>
      <h3><a href={url} target="_blank" rel="noopener noreferrer">{name}<span aria-hidden="true"> ↗</span><span className="sr-only"> (새 탭에서 열기)</span></a></h3>
      <p className="description">{description || '등록된 설명이 없습니다.'}</p>
      <div className="repo-stats">
        <span><i className="language-dot" aria-hidden="true" />{language || '언어 미지정'}</span>
        <span aria-label={`스타 ${stars}개`}>☆ {formatCount(stars)}</span>
        <span aria-label={`포크 ${forks}개`}>⑂ {formatCount(forks)}</span>
      </div>
    </article>
  )
}

export default RepositoryCard
