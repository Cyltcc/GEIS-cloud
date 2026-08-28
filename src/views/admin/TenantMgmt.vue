<template>
	<div class="admin-page">
		<div class="tenant-header">
			<div>
				<div class="page-title">租户管理</div>
			</div>
			<a-button type="primary" class="query-btn" @click="fetchCurrentTenant">
				刷新
			</a-button>
		</div>

		<div class="tenant-overview">
			<a-spin :spinning="currentTenantLoading">
				<div class="overview-main">
					<div>
						<div class="section-title">当前租户</div>
						<div class="tenant-name">{{ currentTenant.name || '-' }}</div>
					</div>
					<a-tag color="blue">tenant_id: {{ currentTenant.id || '-' }}</a-tag>
				</div>
			</a-spin>
		</div>

		<div class="action-grid">
			<section class="panel">
				<div class="panel-header">
					<div>
						<div class="section-title">创建租户</div>
					</div>
				</div>

				<a-form ref="createFormRef" :model="createForm" :rules="createRules" layout="vertical">
					<a-form-item label="租户 ID" name="id" required>
						<a-input v-model:value="createForm.id" placeholder="请输入租户id" />
					</a-form-item>
					<a-form-item label="租户名称" name="name" required>
						<a-input v-model:value="createForm.name" placeholder="请输入租户名称" />
					</a-form-item>
					<a-button type="primary" class="query-btn" :loading="creating" @click="handleCreateTenant">
						创建租户
					</a-button>
				</a-form>
			</section>

			<section class="panel">
				<div class="panel-header">
					<div>
						<div class="section-title">查询租户权益</div>
					</div>
				</div>

				<a-form layout="vertical">
					<a-form-item label="租户 ID">
						<a-input v-model:value="entitlementTenantId" placeholder="请输入 tenant_id"
							@press-enter="fetchEntitlements" />
					</a-form-item>
					<a-button type="primary" class="query-btn" :loading="entitlementLoading" @click="fetchEntitlements">
						查询权益
					</a-button>
				</a-form>
			</section>
		</div>

		<div class="table-box">
			<a-table class="tenant-table" :columns="entitlementColumns" :data-source="entitlements"
				:loading="entitlementLoading" row-key="featureCode" :pagination="false">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'status'">
						<a-switch :checked="record.status === 'active'" checked-children="启用" un-checked-children="禁用"
							:disabled="record.updating" @change="(checked: boolean) => {
								record.status = checked ? 'active' : 'disabled'
							}" />
					</template>

					<template v-if="column.key === 'startsAt'">
						<a-date-picker v-model:value="record.startsAt" style="width: 170px" show-time
							format="YYYY-MM-DD HH:mm:ss" :disabled="record.updating" />
					</template>

					<template v-if="column.key === 'updatedAt'">
						<a-date-picker v-model:value="record.updatedAt" style="width: 170px" show-time
							format="YYYY-MM-DD HH:mm:ss" :disabled="record.updating" />
					</template>

					<template v-if="column.key === 'createdAt'">
						<a-date-picker v-model:value="record.createdAt" style="width: 170px" show-time
							format="YYYY-MM-DD HH:mm:ss" :disabled="record.updating" />
					</template>

					<template v-if="column.key === 'operation'">
						<a-button type="text" style="color: #3969fa" :loading="record.updating"
							@click="handleUpdateEntitlement(record)">
							保存
						</a-button>
					</template>
				</template>
			</a-table>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs, { type Dayjs } from 'dayjs'
import {
	createTenant,
	getCurrentTenant,
	tenantEntitlements,
	updateTenantEntitlements,
	type CreateTenantData,
} from '@/api/tenant'

type UnknownRecord = Record<string, unknown>

interface CurrentTenant {
	id: string
	name: string
}

interface EntitlementRow {
	id: string
	tenantId: string
	featureCode: string
	status: string
	startsAt: Dayjs | null
	createdAt: Dayjs | null
	updatedAt: Dayjs | null
	metadata: Record<string, unknown>
	updating: boolean
}

const currentTenantLoading = ref(false)
const currentTenant = reactive<CurrentTenant>({
	id: '',
	name: '',
})

const createFormRef = ref()
const creating = ref(false)
const createForm = reactive<CreateTenantData>({
	id: '',
	name: '',
})

const createRules = {
	id: [{ required: true, message: '请输入租户 ID', trigger: 'blur' }],
	name: [{ required: true, message: '请输入租户名称', trigger: 'blur' }],
}

const entitlementTenantId = ref('')
const entitlementLoading = ref(false)
const entitlements = ref<EntitlementRow[]>([])

const entitlementColumns = [
	{
		title: '权益 ID',
		dataIndex: 'id',
		key: 'id',
		align: 'center',
		width: 90,
	},
	{
		title: '租户 ID',
		dataIndex: 'tenantId',
		key: 'tenantId',
		align: 'center',
		width: 140,
	},
	{
		title: '功能码',
		dataIndex: 'featureCode',
		key: 'featureCode',
		align: 'center',
	},
	{
		title: '状态',
		dataIndex: 'status',
		key: 'status',
		align: 'center',
		width: 140,
	},
	{
		title: '开始时间',
		dataIndex: 'startsAt',
		key: 'startsAt',
		align: 'center',
		width: 200,
	},
	{
		title: '创建时间',
		dataIndex: 'createdAt',
		key: 'createdAt',
		align: 'center',
		width: 200,
	},
	{
		title: '更新时间',
		dataIndex: 'updatedAt',
		key: 'updatedAt',
		align: 'center',
		width: 200,
	},
	{
		title: '操作',
		key: 'operation',
		dataIndex: 'operation',
		align: 'center',
		width: 100,
	},
]

const getString = (source: UnknownRecord, keys: string[], fallback = '') => {
	for (const key of keys) {
		const value = source[key]
		if (typeof value === 'string' && value.trim()) {
			return value
		}
		if (typeof value === 'number') {
			return String(value)
		}
	}
	return fallback
}


const parseApiTime = (value: string) => {
	if (!value) {
		return null
	}

	const parsed = dayjs(value)
	return parsed.isValid() ? parsed : null
}

const formatApiTime = (value: Dayjs | null) => {
	return value?.isValid() ? value.format('YYYY-MM-DDTHH:mm:ssZ') : undefined
}

const unwrapData = (payload: unknown): unknown => {
	if (payload && typeof payload === 'object' && 'data' in payload) {
		return (payload as { data?: unknown }).data
	}
	return payload
}

const readItems = (payload: unknown) => {
	const data = unwrapData(payload)
	if (Array.isArray(data)) {
		return data
	}

	if (data && typeof data === 'object') {
		const record = data as UnknownRecord
		if (Array.isArray(record.items)) {
			return record.items
		}
	}

	return []
}

const normalizeCurrentTenant = (payload: unknown): CurrentTenant => {
	const data = unwrapData(payload)
	const record = (data || {}) as UnknownRecord

	return {
		id: getString(record, ['id', 'tenant_id', 'tenantId']),
		name: getString(record, ['name', 'tenant_name', 'tenantName']),
	}
}

const normalizeEntitlement = (payload: unknown): EntitlementRow => {
	const record = (payload || {}) as UnknownRecord

	return {
		id: getString(record, ['id']),
		tenantId: getString(record, ['tenant_id', 'tenantId']),
		featureCode: getString(record, ['feature_code', 'featureCode']),
		status: getString(record, ['status'], 'active'),
		startsAt: parseApiTime(getString(record, ['starts_at', 'startsAt'])),
		createdAt: parseApiTime(getString(record, ['created_at', 'createdAt'])),
		updatedAt: parseApiTime(getString(record, ['updated_at', 'updatedAt'])),
		metadata:
			record.metadata && typeof record.metadata === 'object'
				? (record.metadata as Record<string, unknown>)
				: {},
		updating: false,
	}
}

const fetchCurrentTenant = async () => {
	currentTenantLoading.value = true
	try {
		const response = await getCurrentTenant()
		const tenant = normalizeCurrentTenant(response)
		currentTenant.id = tenant.id
		currentTenant.name = tenant.name

		if (!entitlementTenantId.value) {
			entitlementTenantId.value = tenant.id
		}
	} finally {
		currentTenantLoading.value = false
	}
}

const resetCreateForm = () => {
	createForm.id = ''
	createForm.name = ''
	createFormRef.value?.clearValidate?.()
}

const handleCreateTenant = async () => {
	try {
		await createFormRef.value?.validate()
		creating.value = true

		await createTenant({
			id: createForm.id.trim(),
			name: createForm.name.trim(),
		})

		message.success('租户创建成功')
		resetCreateForm()
	} catch (_error) {
		// 表单校验失败或接口错误时保留输入，由请求拦截器统一提示接口错误
	} finally {
		creating.value = false
	}
}

const fetchEntitlements = async () => {
	const tenantId = entitlementTenantId.value.trim()
	if (!tenantId) {
		message.warning('请输入租户 ID')
		return
	}

	entitlementLoading.value = true
	try {
		const response = await tenantEntitlements(tenantId)
		entitlements.value = readItems(response).map(normalizeEntitlement)
	} finally {
		entitlementLoading.value = false
	}
}

const handleUpdateEntitlement = async (record: EntitlementRow) => {
	const tenantId = entitlementTenantId.value.trim()
	if (!tenantId || !record.featureCode || record.updating) {
		return
	}

	record.updating = true
	try {
		await updateTenantEntitlements(tenantId, record.featureCode, {
			status: record.status,
			starts_at: formatApiTime(record.startsAt),
			metadata: {
				...record.metadata,
				created_at: formatApiTime(record.createdAt),
				updated_at: formatApiTime(record.updatedAt),
			},
		})
		message.success('租户功能配置已更新')
	} finally {
		record.updating = false
	}
}

const canQueryEntitlements = computed(() => Boolean(entitlementTenantId.value.trim()))

onMounted(async () => {
	await fetchCurrentTenant()
	if (canQueryEntitlements.value) {
		fetchEntitlements()
	}
})
</script>

<style scoped lang="scss">
.tenant-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 20px;
}

.page-title {
	color: #1d2129;
	font-size: 20px;
	font-weight: 600;
	line-height: 28px;
}

.page-subtitle {
	margin-top: 4px;
	color: #86909c;
	font-size: 13px;
}

.tenant-overview {
	margin-bottom: 18px;
	padding: 18px 20px;
	border: 1px solid #edf0f7;
	background: #fff;
}

.overview-main {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
}

.tenant-name {
	margin-top: 8px;
	color: #1d2129;
	font-size: 24px;
	font-weight: 600;
}

.action-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 16px;
}

.panel {
	padding: 18px 20px;
	border: 1px solid #edf0f7;
	background: #fff;
}

.panel-header {
	margin-bottom: 16px;
}

.section-title {
	color: #1d2129;
	font-size: 16px;
	font-weight: 600;
}

.section-desc {
	margin-top: 4px;
	color: #86909c;
	font-size: 13px;
}

.table-box {
	margin-top: 18px;
	width: 100%;
}

:deep(.tenant-table .ant-table-thead > tr > th) {
	background: #eef2ff;
	color: #1d2129;
	font-weight: 600;
	text-align: center;
	border-bottom: 1px solid #f3f3f3;
	height: 44px;
}

:deep(.tenant-table.ant-table-wrapper .ant-table-container table > thead > tr:first-child > *:first-child) {
	border-start-start-radius: 0 !important;
}

:deep(.tenant-table.ant-table-wrapper .ant-table-container table > thead > tr:first-child > *:last-child) {
	border-start-end-radius: 0 !important;
}

@media (max-width: 900px) {

	.tenant-header,
	.overview-main {
		flex-direction: column;
	}

	.action-grid {
		grid-template-columns: 1fr;
	}
}
</style>
