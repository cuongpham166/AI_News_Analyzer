package com.example.news.api.service.admin.metrics.application.provider;

import com.example.news.api.dto.internal.admin.metrics.application.keycloak.KeycloakApplicationMetrics;
import com.example.news.api.dto.response.admin.AdminEventResponse;
import com.example.news.api.dto.response.admin.UserEventResponse;
import com.example.news.api.util.auth.KeycloakContext;
import com.example.news.api.util.mapper.KeycloakMapper;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.AdminEventRepresentation;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.EventRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class KeycloakMetricsProvider {
    private final KeycloakContext context;
    private final KeycloakMapper keycloakMapper;

    public KeycloakMetricsProvider(
            KeycloakContext context,
            KeycloakMapper keycloakMapper
    ){
        this.context = context;
        this.keycloakMapper = keycloakMapper;
    }

    private int getTotalRealmRoles() {
        List<String> realmRoles = context.getRealm()
                .roles()
                .list()
                .stream()
                .map(RoleRepresentation::getName)
                .toList();
        return realmRoles.size();
    }

    public int getTotalUserEvents(){
        List<UserEventResponse> events = context
                .getRealm()
                .getEvents()
                .stream()
                .map(this.keycloakMapper::mapToUserEventDTO)
                .toList();
        return events.size();
    }

    private int getTotalAdminEvents(){
        List <AdminEventResponse> adminEvents = context
                .getRealm()
                .getAdminEvents()
                .stream()
                .map(this.keycloakMapper::mapToAdminEventDTO)
                .toList();
        return adminEvents.size();
    }

    private Map<String, Long> mapSessionStatsToClientNames(RealmResource realmResource, List<Map<String, String>> rawStatsList) {
        Map<String, Long> mappedStats = new HashMap<>();

        if (rawStatsList == null || rawStatsList.isEmpty()) {
            return mappedStats;
        }

        List<ClientRepresentation> clients = realmResource.clients().findAll();
        Map<String, String> idToClientIdMap = clients.stream()
                .collect(Collectors.toMap(ClientRepresentation::getId, ClientRepresentation::getClientId, (a, b) -> a));

        for (Map<String, String> stat : rawStatsList) {
            String clientUuid = stat.get("id");
            String activeSessions = stat.get("active");

            if (clientUuid != null && activeSessions != null) {
                String clientName = idToClientIdMap.getOrDefault(clientUuid, clientUuid);
                long count = Long.parseLong(activeSessions);
                mappedStats.put(clientName, count);
            }
        }

        return mappedStats;
    }

    public KeycloakApplicationMetrics getKeycloakApplicationMetrics(){
        try {
            RealmResource realmResource = context.getRealm();
            UsersResource usersResource = realmResource.users();

            //user related Metrics
            int totalUsers = usersResource.count();
            int emailVerifiedUsers = usersResource.countEmailVerified(true);
            int enabledUsers = usersResource.count(null, null, null, null, null, null, true, null);
            int disabledUsers = totalUsers - enabledUsers;

            //client session related Metrics
            List<Map<String, String>> rawSessionStats = realmResource.getClientSessionStats();
            Map<String, Long> clientSessionCounts = mapSessionStatsToClientNames(realmResource, rawSessionStats);
            long totalActiveClientSessions = clientSessionCounts.values().stream().mapToLong(Long::longValue).sum();

            return new KeycloakApplicationMetrics(
                    getTotalRealmRoles(),
                    getTotalUserEvents(),
                    getTotalAdminEvents(),
                    "UP",
                    totalUsers,
                    enabledUsers,
                    disabledUsers,
                    emailVerifiedUsers,
                    totalActiveClientSessions,
                    clientSessionCounts,
                    null
            );
        }catch (Exception ex) {
            return KeycloakApplicationMetrics.fallbackWithError(ex.getMessage());
        }
    }
}
