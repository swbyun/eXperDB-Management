package com.experdb.proxy;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.experdb.proxy.db.DBCPPoolManager;
import com.experdb.proxy.db.repository.service.ProxyServiceImpl;
import com.experdb.proxy.db.repository.service.SystemServiceImpl;
import com.experdb.proxy.deamon.DxDaemon;
import com.experdb.proxy.deamon.DxDaemonManager;
import com.experdb.proxy.deamon.IllegalDxDaemonClassException;
import com.experdb.proxy.socket.DXTcontrolAgentSocket;
import com.experdb.proxy.socket.listener.DXTcontrolProxy;
import com.experdb.proxy.socket.listener.ServerCheckListener;
import com.experdb.proxy.util.FileUtil;


/**
* @author 박태혁
* @see
* 
*      <pre>
* == 개정이력(Modification Information) ==
*
*   수정일       수정자           수정내용
*  -------     --------    ---------------------------
*  2018.04.23   박태혁 최초 생성
*      </pre>
*/
public class DaemonStart implements DxDaemon{ 
	
	private Logger daemonStartLogger = LoggerFactory.getLogger("DaemonStartLogger");
	private Logger errLogger = LoggerFactory.getLogger("errorToFile");
	private Logger socketLogger = LoggerFactory.getLogger("socketLogger");
	
	private DXTcontrolAgentSocket socketService;
	private ServerCheckListener serverCheckListener;

	public static void main(String args[]) {
		// -shutdown 옵션이 있을 경우 데몬을 종료시킨다.
		if (args.length > 0 && args[0].equals("-shutdown")) {
			try {
				DxDaemonManager sdm = DxDaemonManager.getInstance(DaemonStart.class);
				sdm.shutdownDaemon();
			} catch (IOException e1) {
				//e1.printStackTrace();
			} catch (IllegalDxDaemonClassException e) {
				//e.printStackTrace();
			}
			
			System.out.println("## "+new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
			System.out.println("## eXperDB Managemen Dammon Process is Shutdown...");
			
			Logger daemonStartLogger = LoggerFactory.getLogger("DaemonStartLogger");
			daemonStartLogger.info("{} eXperDB Managemen Dammon Process is Shutdown...", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
			
			return; // 프로그램 종료.
		}

		DxDaemonManager sdm = null;
		Logger errLogger = LoggerFactory.getLogger("errorToFile");

		try {
			sdm = DxDaemonManager.getInstance(DaemonStart.class);
			sdm.start();
		}  catch (Exception e) {
			errLogger.error("데몬 시작시 에러가 발생하였습니다. {}", e.toString());
			e.printStackTrace();
		}
	}

	private static ApplicationContext context;

	public static ApplicationContext getContext() {
		return context;
	}

	public static void setContext(ApplicationContext context) {
		DaemonStart.context = context;
	}

	//@Override
	public void startDaemon() {
		
		try {
			context = new ClassPathXmlApplicationContext(new String[] {"context-tcontrol.xml"});
			
			SystemServiceImpl service = (SystemServiceImpl) context.getBean("SystemService");
			ProxyServiceImpl proxyService = (ProxyServiceImpl) context.getBean("ProxyService");

			// SqlSessionManager 초기화
			try {
				String strIpadr = FileUtil.getPropertyValue("context.properties", "agent.install.ip");
				String strPort = FileUtil.getPropertyValue("context.properties", "socket.server.port");
				String strVersion = FileUtil.getPropertyValue("context.properties", "agent.install.version");
				String strRootPwd = FileUtil.getPropertyValue("context.properties", "proxy.root.pwd");
socketLogger.info("daemon.strRootPwd : " + strRootPwd);
				service.agentInfoStartMng(strIpadr, strPort, strVersion);
				
				//root properties 삭제
				service.agentPropertiesChg();

			} catch (Exception e) {
				errLogger.error("데몬 시작시 에러가 발생하였습니다. {}", e.toString());
				e.printStackTrace();
				return;
			}		
			
			//Driver 로딩 
			try {
				Class.forName("org.apache.commons.dbcp.PoolingDriver");
				Class.forName("org.postgresql.Driver");
			} catch (Exception e) {
				errLogger.error("데몬 시작시 에러가 발생하였습니다. {}", e.toString());
				return;			
			}
			
			// SqlSessionManager 초기화
			try {
/*				proxyService.proxyServerCfgSetting(strIpadr, strPort);*/
				//scale 자동 실행 로직 추가
				DXTcontrolProxy rSet = new DXTcontrolProxy();
				rSet.start();
			} catch (Exception e) {
				errLogger.error("데몬 시작시 에러가 발생하였습니다. {}", e.toString());
				e.printStackTrace();
				return;
			}
			
			System.out.println("######################################################################");
			System.out.println("## load file ");
			System.out.println("## "+new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
			System.out.println("## eXperDB Managemen Dammon Process is started...");
			System.out.println("######################################################################");
			
			daemonStartLogger.info("{}", "");
			daemonStartLogger.info("{} {}", "eXperDB Managemen Deamon Start..", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));

			service = null;

			serverCheckListener = new ServerCheckListener(context);
			serverCheckListener.start();

			socketService = new DXTcontrolAgentSocket();
			socketService.start();

		} catch(Exception e) {
			errLogger.error("데몬 시작시 에러가 발생하였습니다. {}" + e.toString());
			e.printStackTrace();
		}
	}

	public void shutdown() {
		
		try {
			serverCheckListener.interrupt();
			socketService.stop();
			
			this.shutdownPool();
			
			String strIpadr = FileUtil.getPropertyValue("context.properties", "agent.install.ip");
			String strPort = FileUtil.getPropertyValue("context.properties", "socket.server.port");

			SystemServiceImpl service = (SystemServiceImpl) context.getBean("SystemService");

			service.agentInfoStopMng(strIpadr, strPort);
			
		} catch(Exception e) {
			errLogger.error("데몬 종료시 에러가 발생하였습니다. {0}" + e.toString());
			e.printStackTrace();
		}
	}

	private void shutdownPool() throws Exception {
		DBCPPoolManager dBCPPoolManager = new DBCPPoolManager();
		
		daemonStartLogger.info("{}", "DBCP Pool Shutdown Start ");
		
		for(String poolName : dBCPPoolManager.GetPoolNameList()){
			dBCPPoolManager.shutdownDriver(poolName);
			daemonStartLogger.info("{} {}", poolName, " Shutdown .. ");
		}
		
		daemonStartLogger.info("{}", "DBCP Pool Shutdown End ");
	}

	public void chkDir() {
	}
}