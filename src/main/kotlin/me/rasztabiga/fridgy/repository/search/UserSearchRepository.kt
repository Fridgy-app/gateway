package me.rasztabiga.fridgy.repository.search

import me.rasztabiga.fridgy.domain.User
import org.elasticsearch.index.query.QueryBuilders.queryStringQuery
import org.springframework.data.elasticsearch.core.ReactiveElasticsearchTemplate
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery
import org.springframework.data.elasticsearch.repository.ReactiveElasticsearchRepository
import reactor.core.publisher.Flux

/**
 * Spring Data Elasticsearch repository for the User entity.
 */
interface UserSearchRepository : ReactiveElasticsearchRepository<User, String>, UserSearchRepositoryInternal

interface UserSearchRepositoryInternal {
    fun search(query: String): Flux<User>
}

class UserSearchRepositoryInternalImpl(val reactiveElasticsearchTemplate: ReactiveElasticsearchTemplate) : UserSearchRepositoryInternal {

    override fun search(query: String): Flux<User> {
        val nativeSearchQuery = NativeSearchQuery(queryStringQuery(query))
        return reactiveElasticsearchTemplate.find(nativeSearchQuery, User::class.java)
    }
}
