package me.rasztabiga.fridgy.service

import me.rasztabiga.fridgy.IntegrationTest
import me.rasztabiga.fridgy.config.DEFAULT_LANGUAGE
import me.rasztabiga.fridgy.config.SYSTEM_ACCOUNT
import me.rasztabiga.fridgy.domain.User
import me.rasztabiga.fridgy.repository.UserRepository
import me.rasztabiga.fridgy.repository.search.UserSearchRepository
import me.rasztabiga.fridgy.security.ANONYMOUS
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito.times
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.security.oauth2.core.user.DefaultOAuth2User

private const val DEFAULT_LOGIN = "johndoe"
private const val DEFAULT_EMAIL = "johndoe@localhost"
private const val DEFAULT_FIRSTNAME = "john"
private const val DEFAULT_LASTNAME = "doe"
private const val DEFAULT_IMAGEURL = "http://placehold.it/50x50"
private const val DEFAULT_LANGKEY = "dummy"

/**
 * Integration tests for [UserService].
 */
@IntegrationTest
class UserServiceIT {

    @Autowired
    private lateinit var userRepository: UserRepository

    @Autowired
    private lateinit var userService: UserService

    /**
     * This repository is mocked in the me.rasztabiga.fridgy.repository.search test package.
     *
     * @see me.rasztabiga.fridgy.repository.search.UserSearchRepositoryMockConfiguration
     */
    @Autowired
    private lateinit var mockUserSearchRepository: UserSearchRepository

    private lateinit var user: User

    private lateinit var userDetails: MutableMap<String, Any>

    @BeforeEach
    fun init() {
        userRepository.deleteAllUserAuthorities().block()
        userRepository.deleteAll().block()
        user = User(
            login = DEFAULT_LOGIN,
            activated = true,
            email = DEFAULT_EMAIL,
            firstName = DEFAULT_FIRSTNAME,
            lastName = DEFAULT_LASTNAME,
            imageUrl = DEFAULT_IMAGEURL,
            createdBy = SYSTEM_ACCOUNT,
            langKey = DEFAULT_LANGKEY
        )
        userDetails = mutableMapOf(
            "sub" to DEFAULT_LOGIN,
            "email" to DEFAULT_EMAIL,
            "given_name" to DEFAULT_FIRSTNAME,
            "family_name" to DEFAULT_LASTNAME,
            "picture" to DEFAULT_IMAGEURL
        )
    }

    @Test
    fun testDefaultUserDetails() {
        val authentication = createMockOAuth2AuthenticationToken(userDetails)
        val userDTO = userService.getUserFromAuthentication(authentication).block()

        assertThat(userDTO.login).isEqualTo(DEFAULT_LOGIN)
        assertThat(userDTO.firstName).isEqualTo(DEFAULT_FIRSTNAME)
        assertThat(userDTO.lastName).isEqualTo(DEFAULT_LASTNAME)
        assertThat(userDTO.email).isEqualTo(DEFAULT_EMAIL)
        assertThat(userDTO.activated).isTrue()
        assertThat(userDTO.langKey).isEqualTo(DEFAULT_LANGUAGE)
        assertThat(userDTO.imageUrl).isEqualTo(DEFAULT_IMAGEURL)
        assertThat(userDTO.authorities).contains(ANONYMOUS)
    }

    @Test
    fun testUserDetailsWithUsername() {
        userDetails["preferred_username"] = "TEST"
        val authentication = createMockOAuth2AuthenticationToken(userDetails)
        val userDTO = userService.getUserFromAuthentication(authentication).block()
        assertThat(userDTO.login).isEqualTo("test")
    }

    @Test
    fun testUserDetailsWithLangKey() {
        userDetails["langKey"] = DEFAULT_LANGKEY
        userDetails["locale"] = "en-US"
        val authentication = createMockOAuth2AuthenticationToken(userDetails)
        val userDTO = userService.getUserFromAuthentication(authentication).block()
        assertThat(userDTO.langKey).isEqualTo(DEFAULT_LANGKEY)
    }

    @Test
    fun testUserDetailsWithLocale() {
        userDetails["locale"] = "it-IT"
        val authentication = createMockOAuth2AuthenticationToken(userDetails)
        val userDTO = userService.getUserFromAuthentication(authentication).block()
        assertThat(userDTO.langKey).isEqualTo("it")
    }

    @Test
    fun testUserDetailsWithUSLocaleUnderscore() {
        userDetails["locale"] = "en_US"
        val authentication = createMockOAuth2AuthenticationToken(userDetails)
        val userDTO = userService.getUserFromAuthentication(authentication).block()
        assertThat(userDTO.langKey).isEqualTo("en")
    }

    @Test
    fun testUserDetailsWithUSLocaleDash() {
        userDetails["locale"] = "en-US"
        val authentication = createMockOAuth2AuthenticationToken(userDetails)
        val userDTO = userService.getUserFromAuthentication(authentication).block()
        assertThat(userDTO.langKey).isEqualTo("en")
    }

    private fun createMockOAuth2AuthenticationToken(userDetails: Map<String, Any?>): OAuth2AuthenticationToken {
        val authorities = listOf(SimpleGrantedAuthority(ANONYMOUS))
        val usernamePasswordAuthenticationToken =
            UsernamePasswordAuthenticationToken("anonymous", "anonymous", authorities)
        usernamePasswordAuthenticationToken.details = userDetails
        val user = DefaultOAuth2User(authorities, userDetails, "sub")

        return OAuth2AuthenticationToken(user, authorities, "oidc")
    }
}
