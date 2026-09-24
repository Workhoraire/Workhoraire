# Production Keycloak: build-time options are fixed here so that the server
# starts in optimized mode. The realm file is imported on the first start only.
FROM quay.io/keycloak/keycloak:26.7.4 AS builder
ENV KC_DB=postgres
ENV KC_HEALTH_ENABLED=true
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:26.7.4
COPY --from=builder /opt/keycloak/ /opt/keycloak/
COPY realms/ /opt/keycloak/data/import/
COPY themes/ /opt/keycloak/themes/
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--optimized", "--import-realm"]
