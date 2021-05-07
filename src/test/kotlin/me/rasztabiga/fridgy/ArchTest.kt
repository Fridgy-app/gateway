package me.rasztabiga.fridgy

import com.tngtech.archunit.core.importer.ClassFileImporter
import com.tngtech.archunit.core.importer.ImportOption
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses
import org.junit.jupiter.api.Test

class ArchTest {

    @Test
    fun servicesAndRepositoriesShouldNotDependOnWebLayer() {

        val importedClasses = ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("me.rasztabiga.fridgy")

        noClasses()
            .that()
            .resideInAnyPackage("me.rasztabiga.fridgy.service..")
            .or()
            .resideInAnyPackage("me.rasztabiga.fridgy.repository..")
            .should().dependOnClassesThat()
            .resideInAnyPackage("..me.rasztabiga.fridgy.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses)
    }
}
