package me.rasztabiga.fridgy.web.rest

import me.rasztabiga.fridgy.config.KafkaProperties
import org.apache.kafka.clients.producer.RecordMetadata
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kafka.receiver.KafkaReceiver
import reactor.kafka.receiver.ReceiverOptions
import reactor.kafka.receiver.ReceiverRecord
import reactor.kafka.sender.KafkaSender
import reactor.kafka.sender.SenderOptions
import reactor.kafka.sender.SenderRecord
import java.time.Instant

@RestController
@RequestMapping("/api/gateway-kafka")
class GatewayKafkaResource(private val kafkaProperties: KafkaProperties) {
    private val log = LoggerFactory.getLogger(GatewayKafkaResource::class.java)
    private val sender: KafkaSender<String, String> = KafkaSender.create(
        SenderOptions.create(
            kafkaProperties.getProducerProps()
        )
    )

    @PostMapping("/publish/{topic}")
    fun publish(
        @PathVariable topic: String?,
        @RequestParam message: String,
        @RequestParam(required = false) key: String?
    ): Mono<PublishResult> {
        log.debug("REST request to send to Kafka topic {} with key {} the message : {}", topic, key, message)
        return Mono
            .just(SenderRecord.create<String, String, Any?>(topic, null, null, key, message, null))
            .`as` { records: Mono<SenderRecord<String, String, Any?>?>? -> sender.send(records) }
            .next()
            .map { obj -> obj.recordMetadata() }
            .map { metadata: RecordMetadata ->
                PublishResult(
                    metadata.topic(),
                    metadata.partition(),
                    metadata.offset(),
                    Instant.ofEpochMilli(metadata.timestamp())
                )
            }
    }

    @GetMapping("/consume")
    fun consume(
        @RequestParam("topic") topics: List<String?>?,
        @RequestParam consumerParams: Map<String, String>?
    ): Flux<String> {
        log.debug("REST request to consume records from Kafka topics {}", topics)
        val consumerProps = kafkaProperties.getConsumerProps()
        consumerProps.putAll(consumerParams!!)
        consumerProps.remove("topic")
        val receiverOptions = ReceiverOptions.create<String, String>(consumerProps).subscription(topics)
        return KafkaReceiver.create(receiverOptions).receive()
            .map { obj: ReceiverRecord<String, String> -> obj.value() }
    }

    class PublishResult(
        val topic: String,
        val partition: Int,
        val offset: Long,
        val timestamp: Instant
    )
}
