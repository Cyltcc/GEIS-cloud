import service from '@/utils/request';
import { appConfig } from '@/config/env';
import {
	createMockTenant,
	getMockCurrentTenant,
	getMockTenantEntitlements,
	updateMockTenantEntitlement,
} from '@/mocks/tenant';
import type {
	CreateTenantData,
	UpdateTenantEntitlementData,
} from '@/types/tenant';

export type { CreateTenantData, UpdateTenantEntitlementData } from '@/types/tenant';

export const getCurrentTenant = () => {
	if (appConfig.useMock) {
		return getMockCurrentTenant();
	}

	return service.get('/tenants/me');
}

export const createTenant = (data: CreateTenantData) => {
	if (appConfig.useMock) {
		return createMockTenant(data);
	}

	return service.post('/tenants', data);
}

export const tenantEntitlements = (tenant_id: string) => {
	if (appConfig.useMock) {
		return getMockTenantEntitlements(tenant_id);
	}

	return service.get(`/tenants/${tenant_id}/entitlements`);
}

export const updateTenantEntitlements = (tenant_id: string, feature_code: string, data: UpdateTenantEntitlementData) => {
	if (appConfig.useMock) {
		return updateMockTenantEntitlement(tenant_id, feature_code, data);
	}

	return service.put(`/tenants/${tenant_id}/entitlements/${feature_code}`, data);
}
