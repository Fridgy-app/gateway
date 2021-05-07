package me.rasztabiga.fridgy.web.rest

import me.rasztabiga.fridgy.config.KafkaProperties
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.ProducerRecord
import org.assertj.core.api.Assertions.assertThat
import org.junit.Ignore
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.TestInstance
import org.springframework.http.MediaType
import org.springframework.test.web.reactive.server.WebTestClient
import org.testcontainers.containers.KafkaContainer
import org.testcontainers.utility.DockerImageName
import java.time.Duration

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class GatewayKafkaResourceIT {

    private lateinit var client: WebTestClient

    private var started = false

    private lateinit var kafkaContainer: KafkaContainer

    @BeforeAll
    fun startServer() {
        if (!started) {
            startTestcontainer()
            started = true
        }
    }

    private fun startTestcontainer() {
        // TODO: withNetwork will need to be removed soon
        // See discussion at https://github.com/jhipster/generator-jhipster/issues/11544#issuecomment-609065206
        kafkaContainer = KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:5.5.3")).withNetwork(null)
        kafkaContainer.start()
    }

    @BeforeEach
    fun setup() {
        val kafkaProperties = KafkaProperties()
        val producerProps = getProducerProps()
        kafkaProperties.setProducer(producerProps)

        val consumerGroups = getConsumerProps("default-group")
        consumerGroups["client.id"] = "default-client"
        kafkaProperties.setConsumer(consumerGroups)

        val kafkaResource = GatewayKafkaResource(kafkaProperties)

        client = WebTestClient.bindToController(kafkaResource).build()
    }

    // fails with java.lang.NoClassDefFoundError: Could not initialize class org.apache.kafka.common.utils.AppInfoParser
    @Ignore
    fun producesMessages() {
        client.post().uri("/api/gateway-kafka/publish/topic-produce?message=value-produce")
            .exchange()
            .expectStatus().isOk
            .expectHeader().contentType(MediaType.APPLICATION_JSON)

        val consumerProps = getConsumerProps("group-produce")
        val consumer = KafkaConsumer<String, String>(consumerProps)
        consumer.subscribe(listOf("topic-produce"))
        val records = consumer.poll(Duration.ofSeconds(1))

        assertThat(records.count()).isEqualTo(1)
        val record = records.iterator().next()
        assertThat(record.value()).isEqualTo("value-produce")
    }

    // fails with java.lang.NoClassDefFoundError: Could not initialize class org.apache.kafka.common.utils.AppInfoParser
    @Ignore
    fun consumesMessages() {
        val producerProps = getProducerProps()
        val producer = KafkaProducer<String, String>(producerProps)

        producer.send(ProducerRecord<String, String>("topic-consume", "value-consume"))

        val value = client.get().uri("/api/gateway-kafka/consume?topic=topic-consume")
            .accept(MediaType.TEXT_EVENT_STREAM)
            .exchange()
            .expectStatus().isOk
            .expectHeader().contentTypeCompatibleWith(MediaType.TEXT_EVENT_STREAM)
            .returnResult(String::class.java)
            .responseBody.blockFirst(Duration.ofSeconds(10))

        assertThat(value).isEqualTo("value-consume")
    }

    private fun getProducerProps(): MutableMap<String, Any> {
        val producerProps: MutableMap<String, Any> = HashMap()
        producerProps["key.serializer"] = "org.apache.kafka.common.serialization.StringSerializer"
        producerProps["value.serializer"] = "org.apache.kafka.common.serialization.StringSerializer"
        producerProps["bootstrap.servers"] = kafkaContainer.bootstrapServers
        return producerProps
    }

    private fun getConsumerProps(group: String): MutableMap<String, Any> {
        val consumerProps: MutableMap<String, Any> = HashMap()
        consumerProps["key.deserializer"] = "org.apache.kafka.common.serialization.StringDeserializer"
        consumerProps["value.deserializer"] = "org.apache.kafka.common.serialization.StringDeserializer"
        consumerProps["bootstrap.servers"] = kafkaContainer.bootstrapServers
        consumerProps["auto.offset.reset"] = "earliest"
        consumerProps["group.id"] = group
        return consumerProps
    }
}
