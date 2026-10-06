import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Repository = {
  id: number
  full_name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  topics: string[]
}
type SearchResult = { total_count: number; incomplete_results: boolean; items: Repository[] }
type Search = { query: string; language: string; sort: string; page: number }
const pageSize = 12
const number = new Intl.NumberFormat('ko-KR')

function App() {
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState('')
  const [sort, setSort] = useState('')
  const [search, setSearch] = useState<Search | null>(null)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!search) return
    const controller = new AbortController()
    let active = true
    async function load() {
      setLoading(true)
      setError('')
      setResult(null)
      const params = new URLSearchParams({
        q: `${search!.query}${search!.language ? ` language:${search!.language}` : ''}`,
        per_page: String(pageSize), page: String(search!.page),
      })
      if (search!.sort) { params.set('sort', search!.sort); params.set('order', 'desc') }
      try {
        const response = await fetch(`https://api.github.com/search/repositories?${params}`, {
          signal: controller.signal, headers: { Accept: 'application/vnd.github+json' },
        })
        if (!response.ok) {
          throw new Error(response.status === 403 || response.status === 429
            ? 'GitHub 검색 요청 한도에 도달했습니다. 잠시 후 다시 검색해 주세요.'
            : response.status === 422 ? '검색 조건을 확인해 주세요. 검색어가 너무 길거나 형식이 올바르지 않습니다.'
              : '저장소를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
        }
        const data: SearchResult = await response.json()
        if (active) setResult(data)
      } catch (cause) {
        if (active) setError(cause instanceof TypeError ? '네트워크 연결을 확인하고 다시 시도해 주세요.'
          : cause instanceof Error ? cause.message : '검색 중 오류가 발생했습니다.')
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => { active = false; controller.abort() }
  }, [search])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!query.trim()) { inputRef.current?.focus(); return }
    setSearch({ query: query.trim(), language, sort, page: 1 })
  }

  const pages = result ? Math.ceil(Math.min(result.total_count, 1000) / pageSize) : 0
  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="./" aria-label="RepoLens 홈"><span className="brand-mark" aria-hidden="true">⌕</span>RepoLens<span className="brand-dot">.</span></a>
        <span className="header-note">오픈 소스 탐색의 시작</span>
        <a className="github-link" href="https://github.com" target="_blank" rel="noreferrer">GitHub ↗</a>
      </header>
      <main>
        <section className="search-section" aria-labelledby="page-title">
          <span className="eyebrow"><span /> EXPLORE OPEN SOURCE</span>
          <h1 id="page-title">다음 아이디어가 시작될<br /><span>저장소를 찾아보세요.</span></h1>
          <p className="intro">수많은 오픈 소스 프로젝트 속에서, 당신에게 필요한 코드를 발견하세요.</p>
          <form className="search-form" onSubmit={submit}>
            <label className="sr-only" htmlFor="query">저장소 검색어</label>
            <div className="search-box"><span aria-hidden="true">⌕</span><input ref={inputRef} id="query" value={query} onChange={event => setQuery(event.target.value)} placeholder="저장소 이름, 주제 또는 키워드로 검색" required maxLength={256} autoComplete="off" /><button type="submit" disabled={loading}>{loading ? '검색 중…' : '저장소 검색'}<span aria-hidden="true"> →</span></button></div>
            <div className="filters">
              <label>언어 <select value={language} onChange={event => setLanguage(event.target.value)}><option value="">모든 언어</option>{['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'C++'].map(item => <option key={item}>{item}</option>)}</select></label>
              <label>정렬 <select value={sort} onChange={event => setSort(event.target.value)}><option value="">관련도순</option><option value="stars">스타 많은순</option><option value="updated">최근 업데이트순</option><option value="forks">포크 많은순</option></select></label>
              <span className="filter-hint">GitHub 공개 저장소 검색</span>
            </div>
          </form>
          <div className="suggestions"><span>추천 키워드</span>{['react', 'machine learning', 'developer tools', 'awesome'].map(term => <button key={term} disabled={loading} onClick={() => { setQuery(term); setSearch({ query: term, language, sort, page: 1 }) }}>{term}<span aria-hidden="true"> ↗</span></button>)}</div>
        </section>
        <section className="results-section" aria-labelledby="results-title" aria-busy={loading}>
          <div className="section-heading"><h2 id="results-title">{search ? '검색 결과' : '가능성을 발견하는 공간'}</h2><span>{result ? `${number.format(result.total_count)}개 저장소 · ${search?.page}페이지` : 'REPOSITORIES'}</span></div>
          <div role="status" aria-live="polite">{loading && <div className="empty-state"><span className="spinner" /><h3>저장소를 찾고 있어요</h3><p>GitHub에서 검색 결과를 가져오는 중입니다.</p></div>}</div>
          {error && <div className="empty-state error-state" role="alert"><h3>검색을 완료하지 못했어요</h3><p>{error}</p><button className="secondary-button" onClick={() => setSearch(search ? { ...search } : null)}>다시 시도</button></div>}
          {!loading && !error && !search && <div className="empty-state"><div className="empty-icon" aria-hidden="true">⌕</div><h3>어떤 프로젝트가 궁금한가요?</h3><p>키워드를 검색하거나 추천 키워드를 선택해 보세요.<br />설명, 사용 언어, 스타 수를 한눈에 비교할 수 있어요.</p><span className="empty-caption">좋은 코드를 만나는 새로운 방법</span></div>}
          {!loading && !error && result && <>{result.incomplete_results && <p className="notice">일부 결과만 조회되었습니다. 더 구체적인 키워드로 검색해 보세요.</p>}{result.items.length === 0 ? <div className="empty-state"><h3>일치하는 저장소가 없어요</h3><p>다른 키워드나 언어 조건으로 검색해 보세요.</p></div> : <div className="repository-grid">{result.items.map(repo => <article className="repository-card" key={repo.id}><div className="card-top"><span className="repo-icon" aria-hidden="true">▤</span><span className="public-badge">Public</span></div><h3><a href={repo.html_url} target="_blank" rel="noreferrer">{repo.full_name}<span aria-hidden="true"> ↗</span></a></h3><p className="description">{repo.description || '등록된 설명이 없습니다.'}</p><div className="topics">{repo.topics?.slice(0, 3).map(topic => <span key={topic}>{topic}</span>)}</div><div className="repo-stats"><span><i className="language-dot" />{repo.language || '언어 미지정'}</span><span aria-label={`스타 ${repo.stargazers_count}개`}>☆ {number.format(repo.stargazers_count)}</span><span aria-label={`포크 ${repo.forks_count}개`}>⑂ {number.format(repo.forks_count)}</span></div><div className="updated">업데이트 {new Date(repo.updated_at).toLocaleDateString('ko-KR')}</div></article>)}</div>}{pages > 1 && search && <nav className="pagination" aria-label="검색 결과 페이지"><button disabled={search.page === 1} onClick={() => setSearch({ ...search, page: search.page - 1 })}>← 이전</button><span>{search.page} / {pages}</span><button disabled={search.page >= pages} onClick={() => setSearch({ ...search, page: search.page + 1 })}>다음 →</button></nav>}</>}
        </section>
      </main>
      <footer><span>RepoLens<span className="brand-dot">.</span> <span className="footer-message">코드를 발견하고, 가능성을 연결하세요.</span></span><span>Powered by GitHub API</span></footer>
    </div>
  )
}
export default App
