package com.experdb.management.backup.node.service;

public class TargetMachineVO {

	private int rownum;
	private String name;
	private String user;
	private String uuid;
	private String password;
	private String description;
	private String isProtected;
	private String jobName;
	private String operatingSystem;
	private int connectionStatus;
	private int lastResult;
	private int recoveryPointCount;
	private int recoverySetCount;
	private int backupLocationType;
	private int machineType;
	private int licenseStatus;
	private StringBuffer excludeVolumes;

	public int getRownum() {
		return rownum;
	}

	public void setRownum(int rownum) {
		this.rownum = rownum;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getIsProtected() {
		return isProtected;
	}

	public void setIsProtected(String isProtected) {
		this.isProtected = isProtected;
	}

	public String getJobName() {
		return jobName;
	}

	public void setJobName(String jobName) {
		this.jobName = jobName;
	}

	public String getOperatingSystem() {
		return operatingSystem;
	}

	public void setOperatingSystem(String operatingSystem) {
		this.operatingSystem = operatingSystem;
	}

	public int getConnectionStatus() {
		return connectionStatus;
	}

	public void setConnectionStatus(int connectionStatus) {
		this.connectionStatus = connectionStatus;
	}

	public int getLastResult() {
		return lastResult;
	}

	public void setLastResult(int lastResult) {
		this.lastResult = lastResult;
	}

	public int getRecoveryPointCount() {
		return recoveryPointCount;
	}

	public void setRecoveryPointCount(int recoveryPointCount) {
		this.recoveryPointCount = recoveryPointCount;
	}

	public int getRecoverySetCount() {
		return recoverySetCount;
	}

	public void setRecoverySetCount(int recoverySetCount) {
		this.recoverySetCount = recoverySetCount;
	}

	public int getBackupLocationType() {
		return backupLocationType;
	}

	public void setBackupLocationType(int backupLocationType) {
		this.backupLocationType = backupLocationType;
	}

	public int getMachineType() {
		return machineType;
	}

	public void setMachineType(int machineType) {
		this.machineType = machineType;
	}

	public int getLicenseStatus() {
		return licenseStatus;
	}

	public void setLicenseStatus(int licenseStatus) {
		this.licenseStatus = licenseStatus;
	}

	public StringBuffer getExcludeVolumes() {
		return excludeVolumes;
	}

	public void setExcludeVolumes(StringBuffer excludeVolumes) {
		this.excludeVolumes = excludeVolumes;
	}

}
